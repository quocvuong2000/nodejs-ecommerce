#!/bin/bash

echo "🐳 CREATING EQUIVALENT DOCKER SETUP MANUALLY"
echo "============================================"

# Step 1: Create network (same as networks: section in compose)
echo "1️⃣ Creating network..."
docker network create mysql-network \
  --driver bridge \
  --subnet 172.20.0.0/16

# Step 2: Create volumes (same as volumes: section in compose)
echo "2️⃣ Creating volumes..."
docker volume create master-data
docker volume create slave-data

# Step 3: Start MySQL Master (same as mysql-master service)
echo "3️⃣ Starting MySQL Master..."
docker run -d \
  --name mysql-master \
  --network mysql-network \
  --restart unless-stopped \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=testdb \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=apppassword \
  -v ./master-config:/etc/mysql/conf.d \
  -v master-data:/var/lib/mysql \
  -v ./init-master.sql:/docker-entrypoint-initdb.d/init-master.sql \
  mysql:8.0 \
  --server-id=1 --log-bin=mysql-bin --binlog-format=ROW

# Step 4: Start MySQL Slave (same as mysql-slave service)
echo "4️⃣ Starting MySQL Slave..."
docker run -d \
  --name mysql-slave \
  --network mysql-network \
  --restart unless-stopped \
  -p 3307:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=testdb \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=apppassword \
  -v ./slave-config:/etc/mysql/conf.d \
  -v slave-data:/var/lib/mysql \
  mysql:8.0 \
  --server-id=2 --relay-log=mysql-relay-bin --read-only=1

# Step 5: Start phpMyAdmin (same as phpmyadmin service)
echo "5️⃣ Starting phpMyAdmin..."
docker run -d \
  --name phpmyadmin \
  --network mysql-network \
  --restart unless-stopped \
  -p 8080:80 \
  -e PMA_ARBITRARY=1 \
  phpmyadmin/phpmyadmin

echo "✅ All containers started!"
echo ""
echo "📋 WHAT WE JUST CREATED:"
echo "   🗄️  mysql-master  → localhost:3306"
echo "   🗄️  mysql-slave   → localhost:3307"
echo "   🌐 phpmyadmin    → http://localhost:8080"
echo "   🌐 Network       → mysql-network"
echo "   💾 Volumes       → master-data, slave-data"

# Wait for MySQL to start
echo ""
echo "⏳ Waiting for MySQL servers to start..."
sleep 30

# Configure replication (this step still needs to be done manually)
echo "6️⃣ Configuring replication..."
docker exec mysql-slave mysql -uroot -prootpassword -e "
CHANGE MASTER TO
  MASTER_HOST='mysql-master',
  MASTER_USER='replica',
  MASTER_PASSWORD='replica_password',
  MASTER_AUTO_POSITION=1;
START SLAVE;
"

echo "🎉 Setup complete! Run health check to verify."