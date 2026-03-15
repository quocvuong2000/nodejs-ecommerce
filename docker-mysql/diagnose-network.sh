#!/bin/bash

echo "🔍 NETWORK DIAGNOSIS"
echo "==================="

echo "1️⃣ Container Network Details:"
echo "   Master network info:"
docker inspect mysql-master --format='{{range .NetworkSettings.Networks}}Network: {{.NetworkMode}} | IP: {{.IPAddress}}{{end}}'

echo "   Slave network info:"
docker inspect mysql-slave --format='{{range .NetworkSettings.Networks}}Network: {{.NetworkMode}} | IP: {{.IPAddress}}{{end}}'

echo ""
echo "2️⃣ Available Networks:"
docker network ls

echo ""
echo "3️⃣ Custom Network Details:"
if docker network inspect mysql-network &>/dev/null; then
    echo "   mysql-network exists:"
    docker network inspect mysql-network --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'
else
    echo "   ❌ mysql-network does NOT exist!"
fi

echo ""
echo "4️⃣ Default Bridge Network:"
docker network inspect bridge --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'

echo ""
echo "5️⃣ Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Networks}}"