- Khoá phân tán là gì
- Giả sử chúng ta có 2 ngân hàng, chúng ta có tài khoản ngân hàng A và B, chúng ta muốn chuyển tiền từ tài khoản A sang tài khoản B.
- Thì chúng ta phải đảm bảo rằng mỗi lần chỉ có 1 giao dịch làm thay đổi số dư sử dụng khoá phân tán? vì sao
- Khi chúng ta cố gắng lấy số dư bên A thì hệ thống ngân hàng sẽ khoá tài khoản của chúng ta lại và cấp cho chúng ta 1 key để chúng ta thực hiện xong giao dịch này sẽ mở khoá giao dịch khác nếu 2 giao dịch đồng thời nhau sẽ có conflict đó là khoá phân tán
- xử lý truy cập đồng thời
- khoá phân tán có 2 loại là khoá lạc quan optimistic và khoá bi quan pessimistic
-
- Giả xử có 4 user cùng truy cập vào kho để mua sản phẩm
- khoá pessimistic chặn ngay trước khi vào kho (4 luồng đi vô , 1 luồng xử lý cung cấp key)
- Nhược điểm khiến người dùng không được thoải mái nhưng tính an toàn cao
-
- khoá optimistic là cho tất cả đều vô đc kho nhưng khi đi ra sẽ bị khoá optimistic chặn lại, chọn lựa lại
-
-
- Hình như 2 định nghĩa bị ngược nhau thì phải anh ạ, và em có bổ sung 1 xíu cho các bạn khác:


Optimisic lock sẽ block để compare version, nếu X lock trước Y, nhưng Y lại xử lý xong trước -> X update fail -> X retry

=> Optimistic lock: áp dụng khi có xác suất conflict transaction thấp, -> giảm retry.
=> Pessimistic lock: áp dụng khi có xác suất conflict transaction cao để đảm bảo data consistence.

Optimistic: dùng cho trường hợp các request đến hầu hết sẽ update resource
Pessimistic: dùng cho trường hợp các request đến có cả Update lẫn Get dữ liệu và chủ yếu là Get