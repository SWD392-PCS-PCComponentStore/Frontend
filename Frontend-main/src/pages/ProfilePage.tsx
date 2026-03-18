import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Loader,
  Lock,
  Camera,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { updateUserApi } from "@/api/users";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { User } from "@/types";

type EditMode = "profile" | "password" | null;

export function ProfilePage() {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState<EditMode>(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(user || null);

  // Profile edit form
  const [formName, setFormName] = useState(user?.name || "");
  const [formPhone, setFormPhone] = useState(user?.phone || "");
  const [formAddress, setFormAddress] = useState(user?.address || "");

  // Password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setFormName(user.name);
      setFormPhone(user.phone || "");
      setFormAddress(user.address || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-32 h-32 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-16 h-16 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Cần đăng nhập</h2>
          <p className={`mb-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Vui lòng đăng nhập để xem hồ sơ cá nhân
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    if (!user || !formName.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateUserApi(user.user_id, {
        name: formName,
        phone: formPhone,
        address: formAddress,
      });

      // Update local storage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setProfileData(updatedUser);
      setEditMode(null);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Cập nhật thất bại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      await updateUserApi(user.user_id, {
        password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditMode(null);
      toast.success("Thay đổi mật khẩu thành công");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Thay đổi mật khẩu thất bại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "manager":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "staff":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "manager":
        return "Quản lý";
      case "staff":
        return "Nhân viên";
      default:
        return "Khách hàng";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Hồ sơ cá nhân" }]} />

        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div
            className={`rounded-2xl overflow-hidden mb-8 ${
              isDark
                ? "bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30"
                : "bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200"
            }`}
          >
            <div className="h-0" />

            <div className="px-6 sm:px-8 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 mb-6">
                {/* Avatar */}
                <div className="flex items-end gap-4">
                  <div
                    className={`w-32 h-32 rounded-2xl flex items-center justify-center border-4 ${
                      isDark
                        ? "bg-purple-900/50 border-purple-700"
                        : "bg-purple-100 border-purple-300"
                    }`}
                  >
                    {profileData?.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <div className="text-center">
                        <UserIcon className="w-12 h-12 mx-auto mb-2 text-purple-400" />
                        <p className="text-xs text-gray-400">Ảnh đại diện</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      {profileData?.name}
                    </h1>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(profileData?.role)}`}
                      >
                        {getRoleLabel(profileData?.role)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditMode("profile")}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg font-semibold transition-colors text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div
                className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30"
                    : "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200"
                }`}
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-purple-400" />
                  Thông tin cá nhân
                </h2>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 flex-shrink-0">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Email
                      </p>
                      <p className="font-semibold break-all text-lg">
                        {profileData?.email}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Số điện thoại
                      </p>
                      <p className="font-semibold text-lg">
                        {profileData?.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Địa chỉ
                      </p>
                      <p className="font-semibold text-lg break-all">
                        {profileData?.address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/20 flex-shrink-0">
                      <Calendar className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Ngày tạo tài khoản
                      </p>
                      <p className="font-semibold text-lg">
                        {profileData?.created_at
                          ? formatDate(profileData.created_at)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div
                className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30"
                    : "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200"
                }`}
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  Bảo mật
                </h2>

                <button
                  onClick={() => setEditMode("password")}
                  className="w-full px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg font-semibold transition-colors text-purple-300 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Thay đổi mật khẩu
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <div
                className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30"
                    : "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200"
                }`}
              >
                <h3 className="font-bold mb-4">Trạng thái tài khoản</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Trạng thái
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold border border-green-500/30">
                      Hoạt động
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Vai trò
                    </span>
                    <span className="text-sm font-semibold">
                      {getRoleLabel(profileData?.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div
                className={`rounded-xl p-6 ${
                  isDark
                    ? "bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30"
                    : "bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200"
                }`}
              >
                <h3 className="font-bold mb-4">Thao tác nhanh</h3>
                <div className="space-y-2">
                  <button
                    className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isDark
                        ? "bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30"
                        : "bg-purple-100 hover:bg-purple-200 border border-purple-300"
                    }`}
                  >
                    Đơn hàng của tôi
                  </button>
                  <button
                    className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isDark
                        ? "bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30"
                        : "bg-purple-100 hover:bg-purple-200 border border-purple-300"
                    }`}
                  >
                    Máy tính của tôi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode === "profile" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-2xl w-full max-w-md ${
              isDark
                ? "bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-500/30"
                : "bg-white border border-purple-200"
            } p-6`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-purple-400" />
                Chỉnh sửa thông tin
              </h2>
              <button
                onClick={() => setEditMode(null)}
                className="p-1 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-purple-900/50 border-purple-500/30 focus:border-purple-500"
                      : "bg-purple-50 border-purple-200 focus:border-purple-500"
                  }`}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-purple-900/50 border-purple-500/30 focus:border-purple-500"
                      : "bg-purple-50 border-purple-200 focus:border-purple-500"
                  }`}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Địa chỉ
                </label>
                <textarea
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors resize-none ${
                    isDark
                      ? "bg-purple-900/50 border-purple-500/30 focus:border-purple-500"
                      : "bg-purple-50 border-purple-200 focus:border-purple-500"
                  }`}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(null)}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-500/30 font-semibold hover:bg-purple-500/10 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {editMode === "password" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-2xl w-full max-w-md ${
              isDark
                ? "bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-500/30"
                : "bg-white border border-purple-200"
            } p-6`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Thay đổi mật khẩu
              </h2>
              <button
                onClick={() => setEditMode(null)}
                className="p-1 hover:bg-purple-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-purple-900/50 border-purple-500/30 focus:border-purple-500"
                      : "bg-purple-50 border-purple-200 focus:border-purple-500"
                  }`}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-purple-900/50 border-purple-500/30 focus:border-purple-500"
                      : "bg-purple-50 border-purple-200 focus:border-purple-500"
                  }`}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                    isDark
                      ? "bg-purple-900/50 border-purple-500/30 focus:border-purple-500"
                      : "bg-purple-50 border-purple-200 focus:border-purple-500"
                  }`}
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(null)}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-500/30 font-semibold hover:bg-purple-500/10 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Cập nhật mật khẩu
                  </>
                )}
              </button>
            </div>

            <p
              className={`text-xs mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              💡 Mật khẩu phải có ít nhất 6 ký tự để đảm bảo bảo mật tài khoản
              của bạn.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
