import { useState, useEffect } from 'react';

const CredentialModal = ({ isOpen, onClose, type }) => {
  const [formData, setFormData] = useState({
    interests: '',
    skills: '',
    major: '',
    startYear: '',
    endYear: '',
    isCurrent: false,
    school: '',
    location: ''
  });

  // Reset form when modal opens with a new type
  useEffect(() => {
    if (isOpen) {
      setFormData({
        interests: '',
        skills: '',
        major: '',
        startYear: '',
        endYear: '',
        isCurrent: false,
        school: '',
        location: ''
      });
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const getModalConfig = () => {
    switch (type) {
      case 'profile-focus':
        return {
          title: 'Thêm sở thích, kỹ năng và ngành học',
          icon: (
            <svg className="w-5 h-5 text-[#8d3f41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.5c1.5-2.1 5.4-1.1 5.4 2.1 0 1.8-1.2 3.2-2.7 4.5L12 16l-2.7-2.9C7.8 11.8 6.6 10.4 6.6 8.6c0-3.2 3.9-4.2 5.4-2.1z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 16h2m-5.5 3h9" />
            </svg>
          )
        };
      case 'education':
        return {
          title: 'Thêm học vấn',
           icon: (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          )
        };
      case 'location':
        return {
          title: 'Thêm địa điểm',
           icon: (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        };
      default:
        return { title: 'Thêm thông tin', icon: null };
    }
  };

  const config = getModalConfig();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#242424]/80 backdrop-blur-[2px] transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[620px] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="pl-4 pr-2 pt-2 flex items-center">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors mr-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-4 border-b border-gray-100">
          <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Chỉnh sửa thông tin</h2>
          <p className="text-[15px] text-gray-500 mt-1">Thông tin giúp tăng độ tin cậy cho nội dung của bạn</p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto custom-scrollbar">
          {/* Active Credential Type Header */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex items-center gap-3 mb-6">
            <div className="bg-white p-1.5 rounded-md shadow-sm border border-gray-200 flex items-center justify-center">
              {config.icon}
            </div>
            <span className="font-semibold text-gray-800 text-[15px]">{config.title}</span>
          </div>

          <form className="flex flex-col gap-6">
            {type === 'profile-focus' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-bold text-[#282829]">Sở thích</label>
                  <input 
                    name="interests"
                    type="text" 
                    value={formData.interests}
                    onChange={handleInputChange}
                    placeholder="AI, Mạng xã hội, Nghiên cứu GNN..." 
                    className="w-full px-3.5 py-2.5 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-bold text-[#282829]">Kỹ năng</label>
                  <input 
                    name="skills"
                    type="text" 
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Python, PyTorch, Graph Learning..." 
                    className="w-full px-3.5 py-2.5 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-bold text-[#282829]">Ngành học</label>
                  <input 
                    name="major"
                    type="text" 
                    value={formData.major}
                    onChange={handleInputChange}
                    placeholder="Khoa học máy tính, Hệ thống thông tin..." 
                    className="w-full px-3.5 py-2.5 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] placeholder:text-gray-400"
                  />
                </div>
              </>
            )}

            {type === 'education' && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-bold text-[#282829]">Trường học/Đại học</label>
                  <input 
                    name="school"
                    type="text" 
                    value={formData.school}
                    onChange={handleInputChange}
                    placeholder="Tên trường..." 
                    className="w-full px-3.5 py-2.5 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] placeholder:text-gray-400"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[15px] font-bold text-[#282829]">Chuyên ngành</label>
                  <input 
                    name="major"
                    type="text" 
                    value={formData.major}
                    onChange={handleInputChange}
                    placeholder="Chuyên ngành..." 
                    className="w-full px-3.5 py-2.5 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] placeholder:text-gray-400"
                  />
                </div>
              </>
            )}

            {type === 'location' && (
              <div className="flex flex-col gap-2">
                <label className="text-[15px] font-bold text-[#282829]">Địa điểm</label>
                <input 
                  name="location"
                  type="text" 
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Thành phố, Tỉnh, Quốc gia..." 
                  className="w-full px-3.5 py-2.5 text-[15px] border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] placeholder:text-gray-400"
                />
              </div>
            )}

            {type !== 'profile-focus' && (
              <>
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[15px] font-bold text-[#282829]">Năm bắt đầu</label>
                    <select 
                      name="startYear" 
                      value={formData.startYear} 
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-[15px] bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] cursor-pointer text-gray-700"
                    >
                      <option value="" disabled></option>
                      {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[15px] font-bold text-[#282829]">Năm kết thúc</label>
                    <select 
                      name="endYear" 
                      value={formData.endYear} 
                      onChange={handleInputChange}
                      disabled={formData.isCurrent}
                      className="w-full px-3.5 py-2.5 text-[15px] bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#b04f51] focus:ring-1 focus:ring-[#b04f51] disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer text-gray-700 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled></option>
                      {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i + 5).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="checkbox" 
                    id="isCurrent" 
                    name="isCurrent"
                    checked={formData.isCurrent}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#b04f51] bg-white border-gray-300 rounded focus:ring-[#b04f51] cursor-pointer"
                  />
                  <label htmlFor="isCurrent" className="text-[15px] text-gray-700 cursor-pointer select-none">
                    {type === 'education' ? 'Tôi hiện đang theo học tại đây' : 'Tôi hiện đang sống ở đây'}
                  </label>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2 mt-auto">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-[14px] font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            Hủy
          </button>
          <button className="px-6 py-2 text-[14px] font-medium text-white bg-[#b04f51] hover:bg-[#8d3f41] rounded-full transition-colors shadow-sm">
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CredentialModal;
