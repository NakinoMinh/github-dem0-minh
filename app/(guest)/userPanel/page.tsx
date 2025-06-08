"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Bell, CheckCircle } from "lucide-react";

// Header component
function UserPanelHeader({ onProfileMenuClick, showReminderPanel, onCloseReminderPanel }: { onProfileMenuClick: (id: string) => void, showReminderPanel: boolean, onCloseReminderPanel: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const navLinks = [
    { label: "Trang Chủ", href: "/home" },
    { label: "Bác Sĩ", href: "/doctor" },
    { label: "Đặt Lịch", href: "/booking" },
    { label: "Liên Hệ", href: "/contact" },
  ];
  const [filteredNavLinks, setFilteredNavLinks] = useState(navLinks);

  const profileMenuItems = [
    { id: "edit-profile", label: "Chỉnh sửa hồ sơ" },
    { id: "lab-results", label: "Kết quả xét nghiệm" },
    { id: "medical-history", label: "Lịch sử khám bệnh" },
    { id: "arv", label: "ARV" },
    { id: "reminder-system", label: "Hệ thống nhắc nhở" },
  ];

  function handleSearchNav(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) {
      setFilteredNavLinks(navLinks);
      return;
    }
    setFilteredNavLinks(
      navLinks.filter((link) =>
        link.label.toLowerCase().includes(search.trim().toLowerCase())
      )
    );
  }

  function handleProfileMenuClick(id: string) {
    onProfileMenuClick(id);
    setShowProfileMenu(false);
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed w-full top-0 z-50">
      <div className="w-full px-8 py-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/home" className="flex items-center space-x-3">
          <img src="/logo.jpg" alt="Logo" className="w-[100px] h-auto" />
          <h1 className="font-roboto text-[20px] text-[#879FC5EB] m-0">
            HIV Treatment and Medical
          </h1>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Search bar on the left */}
          <form
            className="flex items-center border rounded px-2 py-1 bg-gray-50 mr-4"
            onSubmit={handleSearchNav}
            style={{ minWidth: 200 }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="outline-none bg-transparent text-sm px-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="text-[#27509f] font-bold px-2">
              🔍
            </button>
          </form>
          <nav className="flex space-x-8 items-center">
            {filteredNavLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
              >
                {label}
              </Link>
            ))}
          </nav>
          {/* Avatar + Profile Menu */}
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
                {showReminderPanel ? (
                  <div>
                    <button className="mb-2 text-blue-600 text-sm" onClick={onCloseReminderPanel}>← Quay lại</button>
                    <ReminderPanel isPopup />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-6 space-y-4">
          {filteredNavLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="block text-[#27509f] font-roboto text-base font-medium no-underline hover:underline"
            >
              {label}
            </Link>
          ))}
          {/* Avatar Mobile Menu */}
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
  );
}

// Reminder panel component
interface Reminder {
  id: number;
  reminderContent: string;
  reminderDate: string;
  status: string;
}

function ReminderPanel({ isPopup }: { isPopup?: boolean } = {}) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState(true);
  const [remindersError, setRemindersError] = useState<string | null>(null);

  const getAuthToken = () => {
    const authDataString = localStorage.getItem("authData");
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        return authData.token;
      } catch (e) {
        console.error("Lỗi đọc token từ localStorage:", e);
        return null;
      }
    }
    const directToken = localStorage.getItem("token");
    if (directToken) {
      console.warn("Token found directly in localStorage. Consider wrapping it in an object like authData.");
      return directToken;
    }
    return null;
  };

  const fetchReminders = async () => {
    const token = getAuthToken();
    if (!token) {
      setRemindersError("Bạn chưa đăng nhập hoặc token không hợp lệ. Vui lòng đăng nhập lại.");
      setRemindersLoading(false);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }
    try {
      setRemindersLoading(true);
      setRemindersError(null);
      const res = await fetch("http://localhost:8080/api/reminders/all/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập. Vui lòng đăng nhập lại.");
        }
        const errorBody = await res.json().catch(() => ({ message: `Lỗi không xác định (${res.status})` }));
        throw new Error(errorBody.message || `Không thể tải nhắc nhở. Mã lỗi: ${res.status}`);
      }
      const data: Reminder[] = await res.json();
      setReminders(data);
    } catch (err: any) {
      console.error("Lỗi khi tải nhắc nhở:", err);
      if (err.message.includes("Failed to fetch") || err instanceof TypeError) {
        setRemindersError("Lỗi kết nối mạng. Vui lòng kiểm tra server hoặc URL.");
      } else {
        setRemindersError(err.message);
      }
    } finally {
      setRemindersLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleMarkAsDone = async (id: number) => {
    const token = getAuthToken();
    if (!token) {
      setRemindersError("Không có token xác thực để cập nhật nhắc nhở.");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/reminders/${id}/done`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Phiên đăng nhập đã hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.");
        }
        const errorBody = await res.json().catch(() => ({ message: `Lỗi cập nhật không xác định (${res.status})` }));
        throw new Error(errorBody.message || "Không thể cập nhật trạng thái nhắc nhở.");
      }
      fetchReminders();
    } catch (err: any) {
      console.error("Lỗi khi đánh dấu đã xong:", err);
      setRemindersError(err.message);
    }
  };

  return (
    <div className={isPopup ? "max-h-[70vh] overflow-y-auto" : "pt-32 md:pt-36 pb-8 px-4 md:px-8 min-h-screen bg-gray-50 font-inter"}>
      <div className="max-w-7xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Bell className="mr-3 text-blue-600" size={32} />
          Hệ thống nhắc nhở
        </h2>
        {remindersLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải nhắc nhở...</p>
          </div>
        ) : remindersError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative" role="alert">
            <strong className="font-bold">Lỗi: </strong>
            <span className="block sm:inline">{remindersError}</span>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-lg">Bạn chưa có nhắc nhở nào.</p>
            <p className="text-gray-500 text-sm mt-2">Hãy tạo nhắc nhở mới để quản lý công việc của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  reminder.status === "DONE" ? "border-green-500 opacity-70" : "border-blue-500"
                } flex flex-col justify-between`}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{reminder.reminderContent}</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Ngày nhắc nhở: <span className="font-medium">{reminder.reminderDate}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Trạng thái: <span className={`font-semibold ${reminder.status === "DONE" ? "text-green-600" : "text-orange-500"}`}>{reminder.status === "DONE" ? "Đã xong" : "Chờ xử lý"}</span>
                  </p>
                </div>
                {reminder.status !== "DONE" && (
                  <button
                    onClick={() => handleMarkAsDone(reminder.id)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center self-start"
                  >
                    <CheckCircle size={18} className="mr-2" /> Đánh dấu đã xong
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {!isPopup && (
        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
          .animate-slide-down {
            animation: slide-down 0.2s ease-out forwards;
          }
          body {
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      )}
    </div>
  );
}

// Main page component
export default function UserPanelPage() {
  const [showReminderPanel, setShowReminderPanel] = useState(false);
  // Điều hướng khi chọn menu profile
  function handleProfileMenuClick(id: string) {
    switch (id) {
      case "edit-profile":
        window.location.href = "/userPanel/edit";
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
        setShowReminderPanel(true);
        break;
      default:
        break;
    }
  }
  function handleCloseReminderPanel() {
    setShowReminderPanel(false);
  }
  return (
    <>
      <UserPanelHeader onProfileMenuClick={handleProfileMenuClick} showReminderPanel={showReminderPanel} onCloseReminderPanel={handleCloseReminderPanel} />
      {!showReminderPanel && <ReminderPanel />}
    </>
  );
}
