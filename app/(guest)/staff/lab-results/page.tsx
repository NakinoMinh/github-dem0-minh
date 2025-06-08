"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Save, X, Menu } from "lucide-react";
import axios from "axios";
import Link from "next/link";

type LabResult = {
  testResultId?: number;
  date: string;
  typeOfTest: string;
  resultDescription: string;
  customerName?: string;
  doctorName?: string;
  customerPhone?: string; // Đã đổi từ 'phone' thành 'customerPhone'
  customerId?: number;
  doctorId?: number;
};

const profileMenuItems = [
  { href: "/profile", label: "Hồ sơ cá nhân" },
  { href: "/test-results", label: "Kết quả xét nghiệm" },
  { href: "/settings", label: "Cài đặt" },
];

export default function LabResults() {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<LabResult>>({});
  const [newData, setNewData] = useState<Partial<LabResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/testresults");
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((item: any, index: number) => ({
            ...item,
            testResultId: item.testResultId ?? item.id ?? index + 1, // Đảm bảo có ID duy nhất
            customerName: item.customerName || item.customer?.fullName || `Khách hàng ${item.customerId ?? "?"}`,
            doctorName: item.doctorName || item.doctor?.fullName || `Bác sĩ ${item.doctorId ?? "?"}`,
            customerPhone: item.customerPhone || item.customer?.phone || "Chưa rõ", // Lấy customerPhone
            date: item.date ? new Date(item.date).toISOString().split("T")[0] : ""
          }));
          setLabResults(mapped);
        } else {
          setError("Dữ liệu trả về không đúng định dạng mảng.");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu kết quả xét nghiệm.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (index: number) => {
    const item = labResults[index];
    setEditIndex(index);
    setEditData({ ...item });
  };

  const handleSave = async (id?: number) => {
    if (!id) {
      alert("Không tìm thấy ID kết quả xét nghiệm để cập nhật.");
      return;
    }
    if (!editData.customerName || editData.customerName.trim() === "") {
      alert("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!editData.doctorName || editData.doctorName.trim() === "") {
      alert("Vui lòng nhập tên bác sĩ.");
      return;
    }
    try {
      const payload = {
        date: editData.date,
        typeOfTest: editData.typeOfTest,
        resultDescription: editData.resultDescription,
        customerName: editData.customerName,
        doctorName: editData.doctorName,
        customerPhone: editData.customerPhone, // Gửi customerPhone lên backend
      };

      const res = await axios.put(`http://localhost:8080/api/testresults/${id}`, payload);
      const updated = [...labResults];
      updated[editIndex!] = {
        ...editData, // Giữ các trường hiện có từ editData
        // Cập nhật các trường có thể thay đổi từ phản hồi của backend
        testResultId: res.data.id ?? res.data.testResultId, // Đảm bảo ID được cập nhật từ response
        customerName: res.data.customerName,
        doctorName: res.data.doctorName,
        customerPhone: res.data.customerPhone, // Cập nhật customerPhone từ response
        date: res.data.date ? new Date(res.data.date).toISOString().split("T")[0] : "",
      } as LabResult;
      setLabResults(updated);
      setEditIndex(null);
      alert("Cập nhật thành công.");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data || err?.message || "Vui lòng kiểm tra server.";
      console.error("Lỗi khi cập nhật:", err);
      alert("Lỗi khi cập nhật: " + errorMsg);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id || isNaN(id)) return;
    if (!confirm("Bạn có chắc chắn muốn xoá?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/testresults/${id}`);
      setLabResults(labResults.filter(item => item.testResultId !== id));
      alert("Xóa thành công.");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data || err?.message || "Vui lòng kiểm tra server.";
      console.error("Lỗi khi xóa:", err);
      alert("Lỗi khi xoá: " + errorMsg);
    }
  };

  const handleAdd = async () => {
    if (!newData.customerName || newData.customerName.trim() === "") {
      alert("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!newData.doctorName || newData.doctorName.trim() === "") {
      alert("Vui lòng nhập tên bác sĩ.");
      return;
    }
    try {
      const payload = {
        date: newData.date,
        typeOfTest: newData.typeOfTest,
        resultDescription: newData.resultDescription,
        customerName: newData.customerName,
        doctorName: newData.doctorName,
        customerPhone: newData.customerPhone, // Gửi customerPhone lên backend
      };

      const res = await axios.post("http://localhost:8080/api/testresults", payload);

      // Đảm bảo dữ liệu từ res.data được mapping đúng và có ID duy nhất
      const addedResult: LabResult = {
        ...res.data,
        testResultId: res.data.id ?? res.data.testResultId, // Lấy ID từ backend response
        date: res.data.date ? new Date(res.data.date).toISOString().split("T")[0] : "",
        customerPhone: res.data.customerPhone, // Cập nhật customerPhone từ response
      };
      setLabResults([...labResults, addedResult]);
      setNewData({}); // Reset form thêm mới
      alert("Thêm dữ liệu thành công.");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.response?.data || err?.message || "Vui lòng kiểm tra server.";
      console.error("Lỗi khi thêm dữ liệu:", err);
      alert("Lỗi khi thêm dữ liệu: " + errorMsg);
    }
  };


  const formatDateVN = (dateStr?: string) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
        <div className="w-full px-8 py-6 flex justify-between items-center">
          <Link href="/home" className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
            <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">HIV Treatment and Medical</h1>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              <Link href="/home" className="text-[#27509f] font-roboto hover:underline">Trang Chủ</Link>
              <Link href="/doctor" className="text-[#27509f] font-roboto hover:underline">Bác Sĩ</Link>
              <Link href="/booking" className="text-[#27509f] font-roboto hover:underline">Đặt Lịch</Link>
              <Link href="/contact" className="text-[#27509f] font-roboto hover:underline">Liên Hệ</Link>
            </nav>
            <div className="relative ml-6">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition">
                <img src="/avatar-custom.jpg" alt="Avatar" className="w-full h-full object-cover" />
              </button>
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border rounded shadow-lg z-50 p-2">
                  <ul className="profile-menu space-y-1">
                    {profileMenuItems.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded" onClick={() => setShowProfileMenu(false)}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2" />
                  <button onClick={() => alert("Đăng xuất")}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
          <button className="md:hidden text-gray-700" onClick={() => {}} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto mt-24 bg-white p-8 rounded shadow pt-24">
        <h2 className="text-4xl font-bold mb-6 text-[#27509f] text-center">Kết quả xét nghiệm</h2>
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <table className="w-full border text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border">Ngày</th>
                <th className="py-2 px-3 border">Loại xét nghiệm</th>
                <th className="py-2 px-3 border">Kết quả</th>
                <th className="py-2 px-3 border">Khách hàng</th>
                <th className="py-2 px-3 border">Điện thoại</th>
                <th className="py-2 px-3 border">Bác sĩ</th>
                <th className="py-2 px-3 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {/* Dòng thêm mới */}
              <tr className="bg-green-50">
                <td className="py-2 px-3 border">
                  <input
                    type="date"
                    value={newData.date || ""}
                    onChange={(e) => setNewData({ ...newData, date: e.target.value })}
                    className="w-full border px-2"
                  />
                </td>
                <td className="py-2 px-3 border">
                  <input
                    value={newData.typeOfTest || ""}
                    onChange={(e) => setNewData({ ...newData, typeOfTest: e.target.value })}
                    className="w-full border px-2"
                  />
                </td>
                <td className="py-2 px-3 border">
                  <input
                    value={newData.resultDescription || ""}
                    onChange={(e) => setNewData({ ...newData, resultDescription: e.target.value })}
                    className="w-full border px-2"
                  />
                </td>
                <td className="py-2 px-3 border">
                  <input
                    value={newData.customerName || ""}
                    onChange={(e) => setNewData({ ...newData, customerName: e.target.value })}
                    className="w-full border px-2"
                  />
                </td>
                <td className="py-2 px-3 border">
                  <input
                    value={newData.customerPhone || ""}
                    onChange={(e) => setNewData({ ...newData, customerPhone: e.target.value })}
                    className="w-full border px-2"
                  />
                </td>
                <td className="py-2 px-3 border">
                  <input
                    value={newData.doctorName || ""}
                    onChange={(e) => setNewData({ ...newData, doctorName: e.target.value })}
                    className="w-full border px-2"
                  />
                </td>
                <td className="py-2 px-3 border">
                  <button onClick={handleAdd} className="text-green-600">
                    <Save size={18} />
                  </button>
                </td>
              </tr>
              {labResults.map((item, index) => (
                <tr key={item.testResultId ?? `temp-${index}`} className="hover:bg-blue-50">
                  {editIndex === index ? (
                    <>
                      <td className="py-2 px-3 border">
                        <input
                          type="date"
                          value={editData.date || ""}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="w-full border px-2"
                        />
                      </td>
                      <td className="py-2 px-3 border">
                        <input
                          value={editData.typeOfTest || ""}
                          onChange={(e) => setEditData({ ...editData, typeOfTest: e.target.value })}
                          className="w-full border px-2"
                        />
                      </td>
                      <td className="py-2 px-3 border">
                        <input
                          value={editData.resultDescription || ""}
                          onChange={(e) => setEditData({ ...editData, resultDescription: e.target.value })}
                          className="w-full border px-2"
                        />
                      </td>
                      <td className="py-2 px-3 border">
                        <input
                          value={editData.customerName || ""}
                          onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                          className="w-full border px-2"
                        />
                      </td>
                      <td className="py-2 px-3 border">
                        <input
                          value={editData.customerPhone || ""}
                          onChange={(e) => setEditData({ ...editData, customerPhone: e.target.value })}
                          className="w-full border px-2"
                        />
                      </td>
                      <td className="py-2 px-3 border">
                        <input
                          value={editData.doctorName || ""}
                          onChange={(e) => setEditData({ ...editData, doctorName: e.target.value })}
                          className="w-full border px-2"
                        />
                      </td>
                      <td className="py-2 px-3 border space-x-2">
                        <button onClick={() => handleSave(item.testResultId)} className="text-green-600">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditIndex(null)} className="text-gray-600">
                          <X size={18} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-3 border">{formatDateVN(item.date)}</td>
                      <td className="py-2 px-3 border">{item.typeOfTest}</td>
                      <td className="py-2 px-3 border">{item.resultDescription}</td>
                      <td className="py-2 px-3 border">{item.customerName}</td>
                      <td className="py-2 px-3 border">{item.customerPhone}</td>
                      <td className="py-2 px-3 border">{item.doctorName}</td>
                      <td className="py-2 px-3 border space-x-2">
                        <button onClick={() => handleEdit(index)} className="text-blue-600">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.testResultId)} className="text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}