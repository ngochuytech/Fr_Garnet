# CampusHub Text Formatting Rules

Hệ thống bình luận và bài viết lưu trữ nội dung dưới dạng **Plain Text** kết hợp các thẻ định dạng **Markdown**. Khi hiển thị nội dung cho người dùng, Frontend sẽ chịu trách nhiệm phân tích (parse) chuỗi Markdown này thành các thẻ HTML tương ứng. Việc này giúp database nhẹ hơn và bảo mật tốt hơn trước các tấn công XSS.

## Cấu trúc lưu trữ (Database Format)

Dữ liệu của trường `content` trong DB sẽ trông như sau:
```text
Đây là một **bình luận** mẫu.
Tôi có thể chèn *in nghiêng* hoặc tạo list:
- Mục 1
- Mục 2

> Đây là trích dẫn.
```

## Bảng quy tắc định dạng (Markdown Syntax)

| Nút bấm (UI) | Ký hiệu Markdown | Hiển thị sau khi Render (HTML) | Giải thích |
| -- | -- | -- | -- |
| **B** (Bold) | `**text**` | `<strong>text</strong>` | Chữ in đậm |
| *I* (Italic) | `*text*` | `<em>text</em>` | Chữ in nghiêng |
| **1.** (Numbered List)| `1. text` | `<ol><li>text</li></ol>` | Danh sách có thứ tự |
| **•** (Bulleted List)| `- text` | `<ul><li>text</li></ul>` | Danh sách chấm đầu dòng |
| **Link** | `[text](url)` | `<a href="url">text</a>` | Gắn liên kết mạng |
| **@** (Mention) | `@username` | `<a href="/user/id">@username</a>` | Gắn thẻ người dùng. Có thể lưu định dạng `@username(user_id)` tùy backend thiết kế. |
| **”** (Quote) | `> text` | `<blockquote>text</blockquote>` | Trích dẫn nội dung |
| `{ }` (Code) | \`\`\`text\`\`\` | `<pre><code>text</code></pre>` | Khối mã lập trình |
| **Σ** (Math) | `$$ equation $$`| `<MathJax>` hoặc `<KaTeX>` | Định dạng công thức toán học |

## Hướng dẫn kết hợp ở Frontend
Để chuyển đổi `content` từ cơ sở dữ liệu lên giao diện, frontend React sẽ sử dụng thư viện **`react-markdown`** kết hợp với **`remark-gfm`** và **`rehype-highlight`**:

```javascript
// Ví dụ về cấu trúc render trên React sau khi lấy từ DB
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PostComment = ({ dbContent }) => {
  return (
    <div className="prose prose-sm max-w-none text-gray-800">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {dbContent}
      </ReactMarkdown>
    </div>
  );
}
```

Quá trình Text Format trên ô Input được thiết kế theo dạng chèn ký tự (Insert Format) giống cơ chế nhập liệu của Github và Reddit.
