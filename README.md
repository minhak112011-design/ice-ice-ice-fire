# 🎀 Web cho bà chã Man An — quà 20/10

Website tình yêu tĩnh (HTML / CSS / JS thuần, không cần build), tông hồng pastel – kem – hồng phấn, lấy cảm hứng bố cục từ video mẫu (màn hình mã PIN → trang chủ → album → thư/phong bì).

## ✅ Đã hoàn thành

| Khu vực | Mô tả |
|---|---|
| **Màn hình mật khẩu** | Mã `0502`. Bàn phím số + ô nhập có nút hiện/ẩn, 4 chấm tiến trình, rung + lời nhắc dễ thương khi sai (gợi ý dần sau nhiều lần sai), hiệu ứng mở khoá bắn tim. Nội dung chính (`#app`) bị `hidden` cho tới khi nhập đúng. |
| **Trang chủ** | Ảnh thật Man An trong khung polaroid nghiêng, lời chào 20/10, tag nhỏ, 3 ghi chú. |
| **Album** | Lưới ảnh, bấm để phóng to (lightbox), chuyển ảnh bằng nút / phím mũi tên / vuốt trên điện thoại, Esc để đóng. |
| **Khung ảnh 3D** | Vòng xoay ảnh 3D (CSS `preserve-3d`), tự xoay, kéo chuột / vuốt tay để xoay, snap về khung gần nhất, nút trái/phải, bật/tắt tự xoay, bấm ảnh để phóng to. |
| **Thư gửi bà chã** | Phong bì có dấu niêm tim, bấm để mở nắp và tờ thư trượt lên; nút "Gấp thư lại". |
| **Nhạc nền** | Dùng **đúng file bạn gửi** (`music/nhac-nen.mp4`, trình duyệt phát track audio trong MP4). Nút phát/dừng, bật/tắt tiếng, thanh EQ + trạng thái. Tự phát ngay sau khi mở khoá (vì đã có tương tác); nếu trình duyệt chặn thì hiện nhắc "Bấm ▶ để nghe nhạc", không phát bất ngờ. |
| **Chi tiết nhỏ** | Tim bay nền (giới hạn số lượng để máy yếu không lag), tim rớt ra khi bấm, toast lời nhắn khi vào tab mới, tôn trọng `prefers-reduced-motion`. |
| **Responsive** | Đã kiểm tra desktop 1280px và mobile 390px: trang chủ, khoá, khung 3D, thư. |

## 📂 Cấu trúc

```
index.html          trang duy nhất (lock screen + 4 khu vực)
css/style.css       toàn bộ giao diện
js/main.js          mật khẩu, điều hướng, album/lightbox, vòng 3D, phong bì, nhạc
images/manan-1.png  ảnh Man An (ảnh thật bạn gửi)
music/nhac-nen.mp4  nhạc nền (đúng file bạn gửi, 7 MB)
vercel.json         cache ảnh/nhạc khi deploy Vercel
```

## ➕ Thêm ảnh (khi bạn gửi thêm ảnh của bả)

1. Bỏ file vào `images/` (đặt tên không dấu, ví dụ `manan-2.jpg`).
2. Mở `js/main.js`, thêm 1 dòng vào mảng `PHOTOS`:
   ```js
   { src: 'images/manan-2.jpg', cap: 'đi chơi hôm đó', alt: 'Man An' },
   ```
   Album, lightbox và vòng 3D tự cập nhật. Nên nén ảnh < 500 KB/tấm (dùng squoosh.app) cho nhẹ.

## 🎵 Về file nhạc

- File bạn gửi là `.mp4` (có hình nền thiên nhiên + nhạc). Website chỉ cần phần âm thanh nên tui gắn thẳng vào thẻ `<audio>` — Chrome / Safari / Firefox đều phát được track AAC trong MP4.
- Tui **không thể tự chuyển đổi sang MP3** trong môi trường này (không có công cụ xử lý media phía server). Nếu muốn nhẹ hơn (7 MB → ~1 MB), bạn làm tay:
  1. Vào https://cloudconvert.com/mp4-to-mp3 (hoặc dùng ffmpeg: `ffmpeg -i nhac-nen.mp4 -vn -b:a 128k nhac-nen.mp3`).
  2. Lưu thành `music/nhac-nen.mp3`.
  3. Trong `index.html`, sửa `src="music/nhac-nen.mp4"` → `src="music/nhac-nen.mp3"`.

## 🔐 Đổi mật khẩu
Mở `js/main.js`, sửa dòng `const PASSWORD = '0502';`. Lưu ý: đây là khoá bằng JavaScript phía trình duyệt, chỉ để tạo bất ngờ, ai xem mã nguồn vẫn thấy được — không phải bảo mật thật.

## ✍️ Sửa lời thư / câu chữ
- Thư: trong `index.html`, phần `<div class="letter-paper">`.
- Lời chào trang chủ: `.hero-title`, `.hero-desc`.
- Lời nhắc khi sai mật khẩu, toast nhỏ: mảng `WRONG_MSGS`, `SMALL_NOTES` trong `js/main.js`.

## ▶️ Chạy thử trên máy
Vì có nhạc nền, nên chạy qua server nhỏ thay vì mở file trực tiếp:
- **Cách 1 (VS Code):** cài extension *Live Server* → chuột phải `index.html` → *Open with Live Server*.
- **Cách 2:** trong thư mục dự án chạy `npx serve .` rồi mở link hiện ra.

## 🚀 Đưa lên Vercel (từng bước, cho người mới)

**Cách A – kéo thả, không cần Git (nhanh nhất)**
1. Tạo tài khoản tại https://vercel.com (đăng nhập bằng Google/GitHub).
2. Vào https://vercel.com/new → kéo cả **thư mục dự án** (chứa `index.html`) vào ô upload.
3. Bấm **Deploy**, chờ ~30 giây → nhận link dạng `ten-du-an.vercel.app`.
4. Gửi link + nhắc bả mật khẩu `0502`. Xong.

**Cách B – qua GitHub (sau này sửa là tự cập nhật)**
1. Tạo repo mới trên https://github.com/new, upload toàn bộ file (hoặc `git push`).
2. Vào https://vercel.com/new → **Import** repo đó.
3. Framework Preset để **Other**, Build Command để trống, Output Directory để trống (hoặc `.`).
4. **Deploy**. Mỗi lần bạn sửa file và push lên GitHub, Vercel tự deploy lại.

Đổi tên miền cho đẹp: Project → Settings → Domains → sửa thành ví dụ `cho-ba-cha-manan.vercel.app`.

## 🧪 Đã kiểm tra
- Console: không lỗi (chỉ 1 cảnh báo thông tin của Chrome về ô password không nằm trong `<form>` — vô hại).
- Mật khẩu đúng/sai, hiện/ẩn, bàn phím số, Enter.
- Chuyển tab, lightbox, vòng 3D, mở/đóng thư.
- Giao diện desktop 1280px và mobile 390px.

## ⏳ Chưa làm / gợi ý tiếp
- Thêm nhiều ảnh thật của Man An (hiện mới có 1 tấm → vòng 3D đang lặp lại tấm đó cho đầy vòng).
- Chuyển nhạc sang MP3 để giảm dung lượng.
- Nếu muốn: đếm ngày yêu nhau, khu "voucher" như video mẫu — tui chưa làm vì bạn chưa cung cấp ngày kỷ niệm / nội dung, tránh bịa.

## Dữ liệu
Không dùng database hay API. Toàn bộ nội dung nằm trong file tĩnh.
