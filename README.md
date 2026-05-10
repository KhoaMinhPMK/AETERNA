# AETERNA - Digital Heritage Platform

AETERNA là một dự án landing page cao cấp dành cho nền tảng di sản kỹ thuật số thế giới mở. Trang web được thiết kế với phong cách hiện đại, sử dụng hiệu ứng chuyển cảnh mượt mà, video nền chất lượng cao và giao diện người dùng (UI) lấy cảm hứng từ các tựa game RPG đỉnh cao như Genshin Impact.

## 📂 Cấu trúc dự án (Project Layout)

Dưới đây là sơ đồ bố cục các thư mục và tập tin chính trong dự án:

```text
AETERNA/
├── index.html              # Tập tin chính, chứa cấu trúc HTML của toàn bộ landing page.
├── assets/                 # Thư mục chứa tài nguyên hệ thống.
│   ├── css/
│   │   └── main.css        # Chứa toàn bộ styles, biến màu sắc, typography và animations.
│   ├── js/
│   │   ├── app.js          # Logic chính điều khiển scroll, preloader và khởi tạo các component.
│   │   ├── content/
│   │   │   ├── assets.js     # Đăng ký các link hình ảnh/icon (từ Figma hoặc local).
│   │   │   └── characters.js # Dữ liệu nội dung cho các phần "Pillars" và "Hero".
│   │   ├── navigation/     # Các thành phần điều hướng (Navbar, Sidebar).
│   │   └── sections/       # Logic hiển thị cho từng phần (Hero, Slider, HeroDetail).
│   └── media/
│       ├── images/         # Logo, hình nền, nhân vật, icon.
│       └── videos/         # Video nền cinematic cho các section Living Heritage & Impact.
├── docs/                   # Tài liệu hướng dẫn và cấu trúc kỹ thuật.
└── tools/                  # Các công cụ hỗ trợ hoặc script bổ sung.
```

---

## 🏗️ Bố cục các Section & Hướng dẫn thay thế hình ảnh

Landing page được chia thành 6 phần chính (Sections). Dưới đây là chi tiết từng phần và các gợi ý thay thế hình ảnh để tối ưu hóa thẩm mỹ:

### 1. Intro (Hero Section)
-   **Nội dung:** Giới thiệu tổng quan về tầm nhìn AETERNA.
-   **Bố cục (Layout):** Full-screen với hiệu ứng hạt (fireflies), thông số kỹ thuật (metrics) và nút scroll xuống.
-   **Thay thế hình ảnh:**
    -   `bgImage`: Thay bằng hình nền phong cảnh 4K (rừng núi, đền đài ASEAN) có độ mờ nhẹ (blur).
    -   `detailArt`: Hình nhân vật chính hoặc biểu tượng di sản (định dạng `.svg` hoặc `.png` không nền).
    -   `logo.svg`: Logo của dự án AETERNA (thay tại `assets/media/images/backgrounds/`).

### 2. Pillars (Slider Section)
-   **Nội dung:** Giới thiệu 5 trụ cột cốt lõi (Edutainment, Neo-ASEAN, Narrative AI, O2O Impact, Global Reach).
-   **Bố cục (Layout):** Slider ngang linh hoạt, thay đổi hình nền và thông tin theo card đang chọn.
-   **Thay thế hình ảnh:**
    -   Mỗi Pillar cần 1 `cardImage` (hình đại diện nhỏ trên slider) và 1 `bgImage` (hình nền lớn tương ứng).
    -   Gợi ý: Sử dụng concept art riêng biệt cho từng chủ đề (ví dụ: Edutainment dùng hình học tập/công nghệ, Neo-ASEAN dùng hình trang phục truyền thống cách điệu).

### 3. Living Heritage (Video Section)
-   **Nội dung:** Giới thiệu thế giới di sản sống động.
-   **Bố cục (Layout):** Video scroll-scrub (video chạy theo tốc độ cuộn trang).
-   **Thay thế video:**
    -   `bgvid-hq.mp4`: Thay bằng video flycam quay cảnh các di sản văn hóa (Angkor Wat, Vịnh Hạ Long, Borobudur...). Dung lượng giữ dưới 10MB để tối ưu tốc độ tải.

### 4. Atlas (World Section)
-   **Nội dung:** Bản đồ 11 quốc gia ASEAN và các tuyến đường di sản.
-   **Bố cục (Layout):** Giao diện radar công nghệ cao, hiển thị các điểm pin di sản (Angkor, Hội An...).
-   **Thay thế hình ảnh:**
    -   Chỉnh sửa các điểm Pin và Label trong `index.html` (dòng 176-179) để khớp với bản đồ mong muốn.
    -   Có thể thêm hình nền map `.svg` vector nếu muốn thay thế lớp radar hiện tại.

### 5. Impact (Video Section 2)
-   **Nội dung:** Tác động từ thế giới ảo đến giá trị thực (Du lịch, Nghệ nhân).
-   **Bố cục (Layout):** Video scroll-scrub tương tự section 3 nhưng với tone màu/nội dung khác.
-   **Thay thế video:**
    -   `bgvid2-hq.mp4`: Video quay cảnh các làng nghề truyền thống hoặc hoạt động du lịch hiện đại.

### 6. Footer
-   **Nội dung:** Wordmark AETERNA và các link tải ứng dụng (App Store, Google Play).
-   **Thay thế hình ảnh:**
    -   Các icon App Store/Play Store (SVG) có thể được thay thế bằng logo tùy chỉnh nếu cần.

---

## 🛠️ Yêu cầu kỹ thuật
-   **Ngôn ngữ:** HTML5, Vanilla CSS, Modern Javascript (ES6+).
-   **Font chữ:** Sử dụng Cinzel (Tiêu đề), Crimson Text (Nội dung) và Montserrat (Giao diện) mang lại cảm giác cổ điển nhưng cao cấp.
-   **Kích thước chuẩn:** Thiết kế tối ưu cho màn hình 1920x1080 nhưng có khả năng responsive cho Mobile & Tablet.

> [!TIP]
> Để dự án đạt hiệu quả thẩm mỹ tốt nhất, hãy đảm bảo tất cả hình ảnh thay thế đều có chất lượng cao (HD/4K) và đồng nhất về phong cách nghệ thuật (Art Style).



Aeterna is a AAA Digital Heritage RPG Platform that utilizes Narrative AI to immortalize the soul of ASEAN. We transcend traditional gaming by merging Fair-play RPG mechanics with a Sustainable O2O Economy.