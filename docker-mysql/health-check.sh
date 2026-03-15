#!/bin/bash

echo "🔍 MYSQL MASTER-SLAVE HEALTH CHECK"
echo "=================================="

# Check if containers are running
echo "📦 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🌐 Network Connectivity:"

# Test 1: Check if containers can ping each other
echo "   Testing slave → master connectivity..."
docker exec mysql-slave ping -c 2 mysql-master > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Network connectivity: WORKING"
else
    echo "   ❌ Network connectivity: FAILED"
fi

# Test 2: Check MySQL master status
echo ""
echo "🗄️  MySQL Master Status:"
docker exec mysql-master mysql -uroot -prootpassword -e "SHOW MASTER STATUS;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Master MySQL: RUNNING"
else
    echo "   ❌ Master MySQL: FAILED"
fi

# Test 3: Check MySQL slave status
echo ""
echo "🔗 MySQL Slave Replication Status:"
docker exec mysql-slave mysql -uroot -prootpassword -e "SHOW SLAVE STATUS\G" 2>/dev/null | grep -E "(Slave_IO_Running|Slave_SQL_Running|Master_Host|Seconds_Behind_Master)"

# Test 4: Test replication by inserting data
echo ""
echo "🧪 Testing Replication:"

# Insert data on master
echo "   Inserting test data on master..."
docker exec mysql-master mysql -uroot -prootpassword -e "
USE testdb;
INSERT INTO users (name, email) VALUES ('Test User $(date +%s)', 'test$(date +%s)@example.com');
SELECT 'Data inserted on MASTER' as status;
"

# Wait for replication
sleep 2

# Check if data appears on slave
echo "   Checking if data replicated to slave..."
docker exec mysql-slave mysql -uroot -prootpassword -e "
USE testdb;
SELECT COUNT(*) as total_users FROM users;
SELECT name, email FROM users ORDER BY id DESC LIMIT 1;
"

# Test 5: Test read-only constraint on slave
echo ""
echo "🔒 Testing Read-Only Constraint on Slave:"
docker exec mysql-slave mysql -uroot -prootpassword -e "
USE testdb;
INSERT INTO users (name, email) VALUES ('Should Fail', 'fail@test.com');
" 2>&1 | grep -q "read-only"

if [ $? -eq 0 ]; then
    echo "   ✅ Slave read-only constraint: WORKING"
else
    echo "   ⚠️  Slave read-only constraint: CHECK NEEDED"
fi

echo ""
echo "🎯 Quick Access Info:"
echo "   Master MySQL: mysql -h localhost -P 3306 -u appuser -p"
echo "   Slave MySQL:  mysql -h localhost -P 3307 -u appuser -p"
echo "   phpMyAdmin:   http://localhost:8080"
echo "   Password:     apppassword"