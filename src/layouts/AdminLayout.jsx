import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Hệ thống',
      items: [
        { path: '/admin/dashboard', label: 'Tổng quan', icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        )},
      ]
    },
    {
      title: 'Quản lý nội dung',
      items: [
        { path: '/admin/reports', label: 'Báo cáo vi phạm', icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        )},
        { path: '/admin/posts', label: 'Bài viết', icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        )},
      ]
    },
    {
      title: 'Người dùng',
      items: [
        { path: '/admin/users', label: 'Người dùng', icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        )},
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden font-sans selection:bg-red-100 selection:text-red-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 z-20">
        <div className="p-8 border-b border-gray-50">
          <Link to="/admin/reports" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-lg shadow-gray-200">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-gray-900">CAMPUSHUB</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Admin Console</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-8">
          {menuItems.map((section) => (
            <div key={section.title}>
              <h3 className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gray-900 text-white shadow-md shadow-gray-200'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`${location.pathname === item.path ? 'text-white' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <Link 
            to="/home" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Về Trang Chủ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Simple Top Bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase">
              <Link to="/admin/reports" className="hover:text-gray-900 transition-colors">Trang quản trị</Link>
              
              {location.pathname.includes('/admin/users') && (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                  <Link to="/admin/users" className={`${location.pathname === '/admin/users' ? 'text-gray-900' : 'hover:text-gray-900 transition-colors'}`}>Người dùng</Link>
                </>
              )}

              {location.pathname.startsWith('/admin/users/') && location.pathname !== '/admin/users' && (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                  <span className="text-gray-900" id="breadcrumb-user-name">Chi tiết</span>
                </>
              )}

              {location.pathname === '/admin/reports' && (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                  <span className="text-gray-900">Báo cáo vi phạm</span>
                </>
              )}
              
              {/* Fallback for other menu items if not caught above */}
              {!location.pathname.includes('/admin/users') && location.pathname !== '/admin/reports' && (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                  <span className="text-gray-900">{menuItems.flatMap(s => s.items).find(i => i.path === location.pathname)?.label || 'Hệ thống'}</span>
                </>
              )}
            </div>
           <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-100 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin&background=111&color=fff" alt="Admin" />
              </div>
           </div>
        </div>
        
        <div className="p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
