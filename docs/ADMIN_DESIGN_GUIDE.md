# CampusHub Admin Design System Guide

Tài liệu này định nghĩa các quy chuẩn thiết kế UI/UX cho Dashboard Admin của CampusHub, giúp đảm bảo tính nhất quán khi phát triển các tính năng mới.

---

## 1. Cấu trúc Layout (Architecture)
Hệ thống sử dụng `AdminLayout.jsx` làm khung cơ bản:
- **Sidebar**: Rộng `288px` (w-72), nền trắng (`bg-white`), border phải (`border-r border-gray-100`).
- **Main Content**: Nền xám cực nhạt (`bg-gray-50/30`), padding mặc định `p-8`.
- **Z-Index**: Sidebar (`z-30`), Modal (`z-50`), Backdrop (`z-40`).

---

## 2. Hệ thống Màu sắc (Color Palette)
Sử dụng các Utility Classes của Tailwind CSS:
- **Primary**: `gray-900` (Text chính, Active State), `gray-500` (Text phụ).
- **Success (Active/Resolved)**: 
    - Text: `emerald-700`
    - Background: `emerald-50`
    - Ring/Border: `emerald-200`
- **Warning (Pending/Open)**: 
    - Text: `amber-700`
    - Background: `amber-50`
    - Ring/Border: `amber-200`
- **Danger (Banned/Error)**: 
    - Text: `red-600`
    - Background: `red-50`
    - Ring/Border: `red-200`
- **Info (Types/Secondary)**: 
    - Blue: `blue-50/blue-600`
    - Purple: `purple-50/purple-600`

---

## 3. Typography & Heading
- **Page Title**: `text-2xl font-black tracking-tight text-gray-900`
- **Section Header**: `text-lg font-bold text-gray-900`
- **Table Header**: `text-[11px] font-bold text-gray-400 uppercase tracking-wider`
- **Body Text**: `text-sm text-gray-600`
- **Monospace (IDs/Codes)**: `font-mono text-xs text-gray-400`

---

## 4. Components Chuẩn (Design Tokens)

### A. Stats Card (Thẻ thống kê)
Dùng để hiển thị các con số quan trọng ở đầu trang.
```jsx
<div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
    {/* SVG Icon */}
  </div>
  <div>
    <p className="text-2xl font-black text-gray-900">1,234</p>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tiêu đề</p>
  </div>
</div>
```

### B. Status Badge (Nhãn trạng thái)
```jsx
const StatusBadge = ({ status }) => {
  const config = {
    OPEN: { label: 'Chờ xử lý', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
    RESOLVED: { label: 'Đã xử lý', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
    CLOSED: { label: 'Đã từ chối', cls: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200' },
  };
  const { label, cls } = config[status];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
};
```

### C. Filter Bar (Thanh lọc)
Kết hợp giữa Tabs và Select Dropdown.
- **Tabs**: `bg-gray-900 text-white` cho active, `text-gray-500 hover:bg-gray-50` for inactive.
- **Select**: `appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5`.

### D. Data Table (Bảng dữ liệu)
- **Container**: `bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`.
- **Row**: `hover:bg-gray-50/60 transition-colors`.
- **Cell Padding**: `px-5 py-4`.

### E. Modal (Hộp thoại)
- **Backdrop**: `fixed inset-0 bg-black/40 backdrop-blur-sm`.
- **Panel**: `relative bg-white rounded-2xl shadow-2xl transition-all animate-in zoom-in-95 duration-200`.

---

## 5. Animation & Interaction
- Sử dụng plugin `tailwindcss-animate`.
- **Page Load**: `animate-in fade-in duration-500`.
- **Hover Buttons**: `transition-all active:scale-95`.
- **Loading State**: Sử dụng Spinner mờ hoặc Skeleton UI.

---

## 6. Iconography
- Ưu tiên sử dụng `Lucide React` (đã được chuyển thành inline SVG).
- Kích thước chuẩn: `16x16` cho button/modal, `18x18` cho stats card, `14x14` cho table actions.
- `strokeWidth`: `2` hoặc `2.5`.
