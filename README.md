# web_Thiep_Cuoi

Website chỉnh sửa và chia sẻ thiệp cưới online theo phong cách đỏ - trắng, tối ưu hiển thị trên điện thoại, cho phép tạo link xem và link sửa mà không cần đăng nhập.

## Giới thiệu

Đây là dự án web thiệp cưới cá nhân mà mình đang xây dựng để phục vụ nhu cầu:

- chỉnh sửa nội dung thiệp trực tiếp trên web
- xem trước thiệp ngay trên điện thoại
- lưu cấu hình thiệp online
- sao chép link xem để gửi cho khách
- sao chép link sửa để tiếp tục chỉnh về sau
- không cần hệ thống đăng nhập phức tạp

Hiện tại dự án đã có phiên bản chạy được với giao diện chỉnh sửa và xem trước trên cùng một trang, đồng thời đã kết nối Supabase để lưu dữ liệu thiệp.

## Mục tiêu dự án

Dự án hướng tới một quy trình đơn giản:

1. người tạo thiệp mở trang ở chế độ chỉnh sửa
2. nhập thông tin cô dâu, chú rể, ngày giờ, địa điểm, ảnh cưới, QR mừng cưới
3. xem trước thiệp ngay trên giao diện điện thoại mô phỏng
4. bấm nút sao chép link xem hoặc link sửa
5. gửi link xem cho người khác để họ mở đúng thiệp đã tạo

## Tính năng đã có

### 1. Chỉnh sửa nội dung thiệp
- tên cô dâu, chú rể
- chữ mở đầu và chữ kết thúc
- ngày cưới, giờ cưới
- địa điểm, link bản đồ
- thông tin hai bên gia đình
- dòng âm lịch / nhằm ngày

### 2. Chỉnh sửa hình ảnh
- ảnh bìa chính
- album ảnh cưới tối đa 10 ảnh
- xóa từng ảnh trong album
- ảnh QR chuyển khoản

### 3. Hiển thị thiệp
- hiệu ứng mở thiệp
- giao diện tông đỏ - trắng
- bố cục phù hợp điện thoại
- xem trước trực tiếp ngay khi chỉnh
- lightbox xem album ảnh cưới

### 4. Lưu và chia sẻ
- lưu cấu hình trong trình duyệt bằng localStorage
- xuất file HTML công khai
- xuất / nhập JSON cấu hình
- lưu dữ liệu thiệp lên Supabase
- sao chép link xem
- sao chép link sửa

## Công nghệ sử dụng

- HTML
- CSS
- JavaScript thuần
- Supabase
- GitHub Pages

## Cấu trúc hoạt động

### Chế độ chỉnh sửa
Khi mở web với `?edit=1`, giao diện editor sẽ hiện ra để chỉnh nội dung thiệp.

Ví dụ:

```text
https://buivikhang04.github.io/web_Thiep_Cuoi/?edit=1
```

### Chế độ xem
Khi mở link có `?card=slug`, trang sẽ tải dữ liệu từ Supabase và hiển thị đúng thiệp đã lưu.

Ví dụ:

```text
https://buivikhang04.github.io/web_Thiep_Cuoi/?card=abc123xyz
```

### Chế độ sửa lại
Khi mở link sửa có `editKey`, người tạo có thể tiếp tục cập nhật thiệp sau này.

## Thiết lập Supabase

Dự án đang dùng bảng:

- `wedding_cards`

Các trường chính:

- `id`
- `slug`
- `edit_key`
- `title`
- `config`
- `created_at`
- `updated_at`

Supabase được dùng để:
- lưu cấu hình JSON của mỗi thiệp
- tạo link xem riêng
- tạo link sửa riêng

## Triển khai

Dự án hiện được triển khai bằng GitHub Pages.

Các bước cơ bản:
1. sửa file `index.html`
2. đẩy lên GitHub repository
3. bật GitHub Pages từ branch `main`
4. dùng link Pages làm trang chỉnh sửa và chia sẻ

## Hiện trạng dự án

Dự án đã hoàn thành phần nền tảng và đang trong giai đoạn hoàn thiện thêm để ổn định hơn và dễ dùng hơn trên điện thoại.

### Đã làm được
- dựng giao diện chỉnh sửa và xem trước
- thiết kế mở thiệp theo phong cách mong muốn
- kết nối Supabase thành công
- tạo được link xem và link sửa
- deploy được lên GitHub Pages

### Đang làm thêm
- tối ưu trải nghiệm chỉnh sửa trên điện thoại
- tinh gọn form chỉnh sửa
- hoàn thiện nút xem trước và điều hướng mobile
- làm giao diện đồng nhất hơn giữa chế độ xem và chế độ sửa
- kiểm tra lại toàn bộ luồng chia sẻ link
- xử lý thêm các lỗi nhỏ về giao diện và dữ liệu

## Kế hoạch phát triển tiếp theo

Trong thời gian tới, mình sẽ tiếp tục hoàn thiện các phần sau:

- cải thiện giao diện mobile editor
- thêm nhạc nền cho thiệp
- tối ưu hiệu ứng mở thiệp mượt hơn
- tối ưu upload ảnh và nén ảnh
- bảo vệ tốt hơn cho link sửa
- bổ sung nhiều mẫu thiệp khác nhau
- tách riêng giao diện quản lý và giao diện khách xem
- nâng cấp trải nghiệm chia sẻ link nhanh hơn

## Ghi chú

Đây là dự án đang được phát triển tiếp, chưa phải phiên bản cuối cùng. Một số phần hiện đã chạy ổn, nhưng mình vẫn đang tiếp tục chỉnh sửa để giao diện đẹp hơn, thao tác mượt hơn và quy trình tạo link tiện hơn.

## Tác giả

**Bùi Vi Khang**

Dự án cá nhân đang được phát triển và hoàn thiện thêm.

## License

Hiện chưa đặt license chính thức.
