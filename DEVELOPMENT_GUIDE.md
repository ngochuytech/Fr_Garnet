# Hướng Dẫn Cấu Trúc Dự Án và Quy Trình Phát Triển

Dự án này được xây dựng bằng **React + Vite** và áp dụng kiến trúc module hóa theo tính năng (Feature-based Architecture). Cách tổ chức này giúp code dễ bảo trì, dễ đọc và dễ dàng mở rộng khi dự án lớn lên.

## 📂 1. Cấu trúc thư mục (`src/`)

- `assets/`: Chứa các tài nguyên tĩnh như hình ảnh, icons, font chữ,...
- `components/`: Chứa các UI Components **dùng chung** trên toàn bộ hệ thống (VD: `Button.jsx`, `Input.jsx`). Các component ở đây ưu tiên tính tái sử dụng, không chứa logic nghiệp vụ phức tạp của ứng dụng.
- `context/`: Chứa các React Context dùng để quản lý state toàn cục (Global State), chia sẻ dữ liệu chung (VD: `AuthContext.jsx` lưu thông tin người dùng đang đăng nhập).
- `features/`: **Đây là phần quan trọng nhất**. Nơi chứa logic nghiệp vụ chia theo tính năng (VD: `auth`, `products`, `users`). Mỗi thư mục tính năng sẽ có:
  - `components/`: UI cho riêng tính năng đó (không dùng ở tính năng khác).
  - `hooks/`: Custom Hooks để xử lý logic, state cho các component của tính năng này.
  - `services/`: Xử lý việc gọi API hoặc tương tác với cơ sở dữ liệu/backend.
- `layouts/`: Các bộ khung bố cục trang (VD: `AuthLayout.jsx`, `MainLayout.jsx` chứa Sidebar, Header...).
- `pages/`: Các component đại diện cho một màn hình lớn/trang cụ thể (tương ứng với các đường dẫn URL). Tại đây, ta sẽ ghép các `Layouts` và `Features Components` lại với nhau.
- `utils/`: Chứa các hàm hỗ trợ chung, tiện ích xử lý (giống như `validators.js` định dạng text, ngày tháng...).

---

## 🚀 2. Quy trình phát triển một tính năng mới

Khi bạn muốn thêm một tính năng mới (Ví dụ: **Quản lý Sinh viên - Students**), hãy code theo trình tự nguyên lý **Dữ liệu trước, Giao diện sau, Ghép nối cuối cùng**.

### Bước 1: Khởi tạo module tính năng
Kiểm tra xem tính năng này có thể nhóm vào đâu:
- Nếu là một component cực nhỏ được dùng ở mọi nơi -> Code vào `src/components/`.
- Nếu là một chức năng nghiệp vụ (như Bài viết, Người dùng, Giỏ hàng) -> Tạo một thư mục con trong `src/features/` (ví dụ: `src/features/students/`).

### Bước 2: Viết tương tác API (`features/students/services`)
Tạo ví dụ tệp `studentService.js`.
- Viết các hàm gọi Axios hoặc Fetch đến phần Backend để lấy dữ liệu, thêm, sửa, xóa (CRUD).

### Bước 3: Viết xử lý Logic & State (`features/students/hooks`)
Tạo ví dụ tệp `useStudentsForm.js` hoặc `useStudents.js`.
- Custom hook này sẽ gọi những hàm trong `services` ở trên, quản lý state như `isLoading`, `error`, `data`.
- Tại đây gọi (import) các hàm bắt lỗi dùng chung từ thư mục `src/utils/` (nếu cần).

### Bước 4: Tạo Giao diện cho tính năng (`features/students/components`)
Tạo các tệp như `StudentList.jsx` hoặc `StudentForm.jsx`.
- Sử dụng Hook vừa tạo ở Bước 3 để lấy dữ liệu và hiển thị lên UI.
- Có thể tái sử dụng các nút bấm, ô input từ thư mục gốc `src/components/`.

### Bước 5: Ghép tính năng vào Layout & Page (`pages/` & `layouts/`)
- Mở hoặc tạo trang mới tại `src/pages/StudentDashboardPage.jsx`.
- Gắn các components như `StudentList`, `StudentForm` vào trong trang này.
- Bọc trang bằng một layout thích hợp (ví dụ hệ thống cần đăng nhập mới vào được thì áp dụng chung `ProtectedRoute.jsx` và một Layout chia cột có Sidebar).

### Bước 6: Định tuyến (Router)
- Lên tệp xử lý định tuyến (Thường là `src/App.jsx` hoặc thư mục `src/routes/`), thêm đường dẫn dẫn đến `StudentDashboardPage.jsx` bạn vừa làm xong.
