#!/bin/bash

echo "📊 DETAILED REPLICATION STATUS"
echo "=============================="

echo "🔍 Master Status Details:"
docker exec mysql-master mysql -uroot -prootpassword -e "
SELECT
    'Master Info' as Info,
    @@server_id as Server_ID,
    @@hostname as Hostname,
    @@log_bin as Binary_Logging,
    @@binlog_format as Binlog_Format;

SHOW MASTER STATUS;

SELECT
    'Active Connections' as Info,
    COUNT(*) as Total_Connections
FROM information_schema.processlist;
"

echo ""
echo "🔍 Slave Status Details:"
docker exec mysql-slave mysql -uroot -prootpassword -e "
SELECT
    'Slave Info' as Info,
    @@server_id as Server_ID,
    @@hostname as Hostname,
    @@read_only as Read_Only_Mode,
    @@relay_log as Relay_Log;

SHOW SLAVE STATUS\G
"

echo ""
echo "📈 Data Comparison:"
docker exec mysql-master mysql -uroot -prootpassword -e "
SELECT 'MASTER' as Source, COUNT(*) as User_Count FROM testdb.users;
"

docker exec mysql-slave mysql -uroot -prootpassword -e "
SELECT 'SLAVE' as Source, COUNT(*) as User_Count FROM testdb.users;
"