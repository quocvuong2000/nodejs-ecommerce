- redis là csdl nhưng khác với csdl truyền thống redis được lưu trong bộ nhớ
- tại sao lại sử dụng redis =>
  - Hiệu xuất cao và đồng thời cao
  - Giả sử người dùng truy cập vào một số dữ liệu trong csdl đầu tiên => quá trình này sẽ chậm hơn vì nó được đọc từ đĩa cứng (disc), sau đó ng dùng truy cập 1 lần nữa thì nó sẽ truy cập vào bộ đệm để lấy ra (cache)
  - Tính đồng thời cao : các yêu cầu mà các cache hoạt động trực tiếp có thể chịu đựng đc lớn hơn nhiều so vs csdl, vì v chúng ta có thể xem xét chuyển 1 phần csdl sang cache, để yêu cầu người dùng có thể truy cập vào bộ cache mà ko cần thông qua csdl

- Memcached vs redis
  - Memcached hỗ trợ mỗi string,
  - chỉ trên memory nên khi sập là mất
  - đa luồng
  - -------------------
  - Redis hỗ trợ nhiều loại phong phú hơn key, value, list ,collection, băm hash string.
  - Redis có tính hỗ trợ bền bỉ lưu trữ trên disc, có thể tải lại sử dụng khi khởi động lại
  - đơn luồng
  - hỗ trợ cluster
  - Redis đâu có lưu được ở disk đâu. Nó lưu trên ram mà ??
Một highlight của redis là tuy nó chạy trên single thread nhưng nó chạy dạng IO multiplexing & Epolling. Giúp thread listen đc từ rất nhiều socket đến thread sau đó delegate vào task queue.

- redis có bao nhiêu kiểu dữ liệu? và kịch bản sử dụng
  - Strings => get, set , mGet, mSet
  - sử dụng làm cache , số lượng block nhỏ
  - ----------------------
  - Hashes => hGet, hSet, hGetAll
  - lưu trữ thông tin người dùng, ...
  - ----------------------
  - Lists =>
  - danh sách following, follower
  - push or pop
  - ----------------------
  - Sets => uion
  - set có thể tự động sắp xếp các bản sao
  - quá trình tìm giao điểm
  - ----------------------
  - Sorted Sets
  - zset
  - xếp hạng quà tặng momo
  - tin nhắn chặn
  - ----------------------
  -
  - ----------------------
  -
  - ----------------------

- Redis giải quyết cơ chế hết hạn dữ liệu thế nào
- What is Cache Invalidation?
- https://redis.io/glossary/cache-invalidation/
  - Redis có nhiều cơ chế làm sạch dữ liệu

- Giải quyết cạnh tranh đồng thời trong redis
- Giải quyết nhất quán dữ liệu


-- Nên coi redis vs mysql

command prepare
$ sysbench --db-driver=mysql --mysql-user=user --mysql_password=password --mysql-db=myqb --mysql-host=192.168.43.163 --mysql-port=3306 --tables=16 --table-size=10000 --threads=4 --time=200 --events=0 --report-interval=1 usr/bin/oltp_read_write prepare

command run
$ sysbench --db-driver=mysql --mysql-user=user --mysql_password=password --mysql-db=myqb --mysql-host=192.168.43.163 --mysql-port=3306 --tables=16 --table-size=10000 --threads=4 --time=200 --events=0 --report-interval=1 usr/bin/oltp_read_write run 