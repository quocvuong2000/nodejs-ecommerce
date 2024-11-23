# Refresh token bị đánh cắp ở phía client, client report ?

=> Khi login 1 cách hợp lệ , server không biết bạn là ai
=> Hệ thống noti trên FB => "Bạn có từng login tại xxx ở device yyy không" , đây là cái bất thường FB report về
=> 1 bộ key abc đã dùng để request bộ key mới => nên bộ key này đã outdated
=> vì hacker vẫn dùng cái RF đó để refresh tiếp nên server sẽ detect đc bất thường
=> Force cả 2 đăng nhập lại