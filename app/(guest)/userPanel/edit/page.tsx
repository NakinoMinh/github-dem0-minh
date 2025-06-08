"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const BASE_URL = "http://localhost:8080";

export default function UserProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    gender: "male",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; dob?: string }>(
    {}
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const userId = 1; // Replace with actual authenticated user ID

  useEffect(() => {
    // Fetch user profile on mount
    async function fetchUser() {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Không thể tải hồ sơ người dùng.");
        }
        const data = await response.json();
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          dob: data.dob || "",
          gender: data.gender || "",
        });
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Có lỗi xảy ra";
        alert(errMsg);
      }
    }
    fetchUser();
  }, [userId]);

  // Sửa lại validateForm để có type cho newErrors
  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phone?: string; dob?: string } = {};
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!form.dob.trim()) newErrors.dob = "Vui lòng nhập ngày sinh";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sửa lại handleSubmit và catch error
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
      }
      setSuccessMsg("Cập nhật hồ sơ thành công!");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Có lỗi xảy ra";
      alert(errMsg);
    }
  };

  const navLinks = [
    { href: "/home", label: "Trang chủ" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/services", label: "Dịch vụ" },
    { href: "/contact", label: "Liên hệ" },
  ];

  const profileMenuItems = [
    { id: "edit-profile", label: "Chỉnh sửa hồ sơ" },
    { id: "lab-results", label: "Kết quả xét nghiệm" },
    { id: "medical-history", label: "Lịch sử khám bệnh" },
    { id: "arv", label: "ARV" },
    { id: "reminder-system", label: "Hệ thống nhắc nhở" },
  ];

  const handleProfileMenuClick = (id: string) => {
    switch (id) {
      case "edit-profile":
        setIsEditing(true);
        break;
      case "lab-results":
        window.location.href = "/userPanel/lab-results";
        break;
      case "medical-history":
        window.location.href = "/userPanel/medical-history";
        break;
      case "arv":
        window.location.href = "/userPanel/arv";
        break;
      case "reminder-system":
        window.location.href = "/profile/reminders";
        break;
      default:
        break;
    }
    setShowProfileMenu(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
        <div className="w-full px-8 py-6 flex justify-between items-center">
          <Link href="/home" className="flex items-center space-x-3">
            <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
            <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
              HIV Treatment and Medical
            </h1>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <form
              className="flex items-center border rounded px-2 py-1 bg-gray-50 mr-4"
              onSubmit={(e) => e.preventDefault()}
              style={{ minWidth: 200 }}
            >
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="outline-none bg-transparent text-sm px-2"
              />
              <button type="submit" className="text-[#27509f] font-bold px-2">
                🔍
              </button>
            </form>
            <nav className="flex space-x-8 items-center">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
              >
                <img
                  src="/avatar.jpg"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg z-50 p-2">
                  <ul className="profile-menu space-y-1">
                    {profileMenuItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href="#"
                          data-content-id={item.id}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                          onClick={() => handleProfileMenuClick(item.id)}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-2" />
                  <button
                    onClick={() => alert("Đăng xuất")}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-6 space-y-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="block text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
              >
                {label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src="/avatar.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-medium text-gray-800">Tài Khoản</span>
              </div>
              <ul className="profile-menu space-y-1">
                {profileMenuItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href="#"
                      data-content-id={item.id}
                      className="block text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
                      onClick={() => handleProfileMenuClick(item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <hr className="my-3" />
              <button
                onClick={() => alert("Đăng xuất")}
                className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto mt-20 p-10 bg-white rounded-3xl shadow-md">
        <h2 className="text-4xl font-bold mb-6 text-[#27509f] text-center">Hồ sơ cá nhân</h2>
        {successMsg && (
          <p className="mb-8 text-green-600 font-semibold text-center">
            {successMsg}
          </p>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.name && (
                <p className="mt-1 text-red-600 font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.email && (
                <p className="mt-1 text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.phone && (
                <p className="mt-1 text-red-600 font-medium">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Địa chỉ
              </label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Ngày sinh
              </label>
              <input
                id="dob"
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.dob && (
                <p className="mt-1 text-red-600 font-medium">{errors.dob}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-gray-700 font-semibold"
              >
                Giới tính
              </label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="flex justify-end space-x-6 mt-12">
              <button
                type="button"
                className="px-8 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Lưu
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-3xl mx-auto rounded-3xl bg-white shadow-md p-12 text-gray-600 text-lg space-y-6">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 w-1/3">Họ và tên</span>
              <span className="w-2/3">{form.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 w-1/3">Email</span>
              <span className="w-2/3">{form.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 w-1/3">Số điện thoại</span>
              <span className="w-2/3">{form.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 w-1/3">Địa chỉ</span>
              <span className="w-2/3">{form.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 w-1/3">Ngày sinh</span>
              <span className="w-2/3">{form.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 w-1/3">Giới tính</span>
              <span className="w-2/3">
                {form.gender === "male"
                  ? "Nam"
                  : form.gender === "female"
                  ? "Nữ"
                  : "Khác"}
              </span>
            </div>
            <div className="flex justify-end mt-12">
              <button
                className="px-10 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

