"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function userPanel() {
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

  // Xử lý tìm kiếm nav
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
        window.location.href = "/profile/reminders";
        break;
      default:
        break;
    }
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
