#!/bin/bash

echo "🧪 COMPREHENSIVE MYSQL REPLICATION TEST"
echo "======================================="

# Test 1: Container Health
echo "1️⃣ Testing Container Health..."
for container in mysql-master mysql-slave phpmyadmin; do
    if docker ps | grep -q $container; then
        echo "   ✅ $container: Running"
    else
        echo "   ❌ $container: Not running"
        exit 1
    fi
done

# Test 2: Network Connectivity
echo ""
echo "2️⃣ Testing Network Connectivity..."
if docker exec mysql-slave ping -c 1 mysql-master > /dev/null 2>&1; then
    echo "   ✅ Slave can reach Master"
else
    echo "   ❌ Network connectivity failed"
    exit 1
fi

# Test 3: MySQL Service Health
echo ""
echo "3️⃣ Testing MySQL Service Health..."

# Test master
if docker exec mysql-master mysql -uroot -prootpassword -e "SELECT 1;" > /dev/null 2>&1; then
    echo "   ✅ Master MySQL: Responsive"
else
    echo "   ❌ Master MySQL: Not responsive"
    exit 1
fi

# Test slave
if docker exec mysql-slave mysql -uroot -prootpassword -e "SELECT 1;" > /dev/null 2>&1; then
    echo "   ✅ Slave MySQL: Responsive"
else
    echo "   ❌ Slave MySQL: Not responsive"
    exit 1
fi

# Test 4: Replication Status
echo ""
echo "4️⃣ Testing Replication Status..."
SLAVE_IO=$(docker exec mysql-slave mysql -uroot -prootpassword -e "SHOW SLAVE STATUS\G" 2>/dev/null | grep "Slave_IO_Running:" | awk '{print $2}')
SLAVE_SQL=$(docker exec mysql-slave mysql -uroot -prootpassword -e "SHOW SLAVE STATUS\G" 2>/dev/null | grep "Slave_SQL_Running:" | awk '{print $2}')

if [[ "$SLAVE_IO" == "Yes" && "$SLAVE_SQL" == "Yes" ]]; then
    echo "   ✅ Replication: Working (IO: $SLAVE_IO, SQL: $SLAVE_SQL)"
else
    echo "   ❌ Replication: Failed (IO: $SLAVE_IO, SQL: $SLAVE_SQL)"
    echo "   💡 Check replication setup"
fi

# Test 5: Data Replication
echo ""
echo "5️⃣ Testing Data Replication..."

# Insert test data on master
TIMESTAMP=$(date +%s)
docker exec mysql-master mysql -uroot -prootpassword -e "
USE testdb;
INSERT INTO users (name, email) VALUES ('TestUser-$TIMESTAMP', 'test$TIMESTAMP@example.com');
"

# Wait for replication
sleep 2

# Check if data replicated to slave
MASTER_COUNT=$(docker exec mysql-master mysql -uroot -prootpassword -e "SELECT COUNT(*) FROM testdb.users;" 2>/dev/null | tail -n 1)
SLAVE_COUNT=$(docker exec mysql-slave mysql -uroot -prootpassword -e "SELECT COUNT(*) FROM testdb.users;" 2>/dev/null | tail -n 1)

if [[ "$MASTER_COUNT" == "$SLAVE_COUNT" ]]; then
    echo "   ✅ Data Replication: Working ($MASTER_COUNT records on both)"
else
    echo "   ❌ Data Replication: Failed (Master: $MASTER_COUNT, Slave: $SLAVE_COUNT)"
fi

# Test 6: Read-Only Enforcement
echo ""
echo "6️⃣ Testing Read-Only Enforcement..."
if docker exec mysql-slave mysql -uroot -prootpassword -e "USE testdb; INSERT INTO users (name, email) VALUES ('should-fail', 'fail@test.com');" 2>&1 | grep -q "read-only"; then
    echo "   ✅ Read-Only: Properly enforced"
else
    echo "   ⚠️  Read-Only: May not be enforced"
fi

# Test 7: Web Interface
echo ""
echo "7️⃣ Testing Web Interface..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "   ✅ phpMyAdmin: Accessible"
else
    echo "   ❌ phpMyAdmin: Not accessible"
fi

echo ""
echo "🎯 SUMMARY:"
echo "   📍 Master MySQL:  localhost:3306 (user: appuser, pass: apppassword)"
echo "   📍 Slave MySQL:   localhost:3307 (user: appuser, pass: apppassword)"
echo "   📍 phpMyAdmin:    http://localhost:8080"
echo ""
echo "✅ Test completed!"