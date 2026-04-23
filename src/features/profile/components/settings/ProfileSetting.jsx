import { useProfileSetting } from "../../hooks/settings/useProfileSetting";

const SettingsTab = () => {
  const {
    isEditingInformation,
    isEditingPassword,
    isFetching,
    isSavingInformation,
    isSavingPassword,
    toggleEditing,
    toggleEditingPassword,
    formDataInformation,
    formDataPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    handleSubmitPassword
  } = useProfileSetting();
  return (
    <div className="w-full mt-4 flex flex-col gap-8 text-[#282829]">
      <style>{`
        /* Hide default browser password reveal eye icon */
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      <h2 className="text-xl font-bold mb-2">Cài đặt tài khoản</h2>
      
      {isFetching ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <svg className="animate-spin h-8 w-8 text-[#b04f51]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm text-gray-500 font-medium">Đang tải thông tin...</p>
        </div>
      ) : (
        <>

      {/* Phần 1: Thông tin cá nhân */}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Thông tin cá nhân</h3>
          {!isEditingInformation && (
            <button
              type="button"
              onClick={toggleEditing}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              title="Chỉnh sửa thông tin"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center py-3">
            <div className="w-1/3 font-medium text-sm text-gray-600">Tên</div>
            <div className="w-2/3 flex items-center">
              {isEditingInformation ? (
                <input
                  type="text"
                  name="fullname"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#b04f51] outline-none text-sm transition-all"
                  value={formDataInformation.fullname}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                />
              ) : (
                <span className="text-sm font-semibold">{formDataInformation.fullname}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <div className="w-1/3 font-medium text-sm text-gray-600">Ngày sinh</div>
            <div className="w-2/3 flex items-center">
              {isEditingInformation ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-auto px-3 py-1.5 border border-gray-300 rounded focus:border-[#b04f51] outline-none text-sm transition-all"
                  value={formDataInformation.dateOfBirth}
                  onChange={handleChange}
                />
              ) : (
                <span className="text-sm font-medium">{formDataInformation.dateOfBirth || "Chưa cập nhật"}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <div className="w-1/3 font-medium text-sm text-gray-600">Số điện thoại</div>
            <div className="w-2/3 flex items-center">
              {isEditingInformation ? (
                <input
                  type="text"
                  name="phone"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#b04f51] outline-none text-sm transition-all"
                  value={formDataInformation.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                />
              ) : (
                <span className="text-sm font-medium">{formDataInformation.phone || "Chưa cập nhật"}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <div className="w-1/3 font-medium text-sm text-gray-600">Giới tính</div>
            <div className="w-2/3 flex items-center text-sm">
              {isEditingInformation ? (
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={formDataInformation.gender === "Nam"}
                      onChange={handleChange}
                      className="mr-2 accent-[#b04f51]"
                    />
                    Nam
                  </label>
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={formDataInformation.gender === "Nữ"}
                      onChange={handleChange}
                      className="mr-2 accent-[#b04f51]"
                    />
                    Nữ
                  </label>
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="radio"
                      name="gender"
                      value="Không tiết lộ"
                      checked={formDataInformation.gender === "Không tiết lộ"}
                      onChange={handleChange}
                      className="mr-2 accent-[#b04f51]"
                    />
                    Không tiết lộ
                  </label>
                </div>
              ) : (
                <span className="font-medium">{formDataInformation.gender === "Không tiết lộ" ? null : formDataInformation.gender}</span>
              )}
            </div>
          </div>
        </div>

        {isEditingInformation && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={toggleEditing}
              className="px-5 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSavingInformation}
              className="px-5 py-1.5 text-sm font-semibold text-white bg-[#b04f51] hover:bg-[#8e3e40] rounded-full transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSavingInformation && (
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSavingInformation ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        )}
      </form>

      {/* Phần 2: Email & Liên kết tài khoản */}
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-2 uppercase">Các tài khoản liên kết & Liên hệ</h3>
        <div className="flex justify-between items-center py-3">
          <div className="w-1/3 font-medium text-sm text-gray-600">Email</div>
          <div className="w-2/3 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800">{formDataInformation.email}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-bold uppercase">Chính</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-t border-gray-100">
          <div className="w-1/3 font-medium flex items-center gap-2 text-sm text-gray-600">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Google
          </div>
          <div className="w-2/3 flex flex-col items-start gap-1">
            <span className="text-sm font-medium">ngochuytech@gmail.com</span>
            <button className="text-gray-400 hover:text-gray-600 hover:underline text-[13px] text-left">Ngắt kết nối</button>
          </div>
        </div>
      </div>

      {/* Phần 3: Mật khẩu */}
      <form onSubmit={handleSubmitPassword} className="flex flex-col">
        <h3 className="text-sm font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-2 uppercase">Bảo mật</h3>
        
        {isEditingPassword ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex justify-between items-center">
              <div className="w-1/3 font-medium text-sm text-gray-600">Mật khẩu hiện tại</div>
              <div className="w-2/3 relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#b04f51] outline-none text-sm transition-all"
                  value={formDataPassword.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/3 font-medium text-sm text-gray-600">Mật khẩu mới</div>
              <div className="w-2/3 relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#b04f51] outline-none text-sm transition-all"
                  value={formDataPassword.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/3 font-medium text-sm text-gray-600">Xác nhận mật khẩu</div>
              <div className="w-2/3 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:border-[#b04f51] outline-none text-sm transition-all"
                  value={formDataPassword.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Xác nhận mật khẩu mới"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={toggleEditingPassword}
                className="px-5 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSavingPassword}
                className="px-5 py-1.5 text-sm font-semibold text-white bg-[#b04f51] hover:bg-[#8e3e40] rounded-full transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSavingPassword && (
                  <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSavingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center py-3">
            <div className="w-1/3 font-medium text-sm text-gray-600">Mật khẩu</div>
            <div className="w-2/3">
              <button
                type="button"
                onClick={toggleEditingPassword}
                className="text-[#2b6dad] hover:underline text-sm font-semibold"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        )}
      </form>
      </>
      )}
    </div>
  );
};

export default SettingsTab;
