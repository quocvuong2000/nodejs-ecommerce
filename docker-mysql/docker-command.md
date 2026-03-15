# One simple command starts everything in correct order
docker-compose up -d

# Must start each container individually in correct order
docker start mysql-master
sleep 10  # Wait for master to be ready
docker start mysql-slave
docker start phpmyadmin

# Stops all related containers
docker-compose stop

# Must stop each container individually
docker stop phpmyadmin mysql-slave mysql-master

# View all logs together
docker-compose logs

# View specific service logs
docker-compose logs mysql-master
docker-compose logs mysql-slave

# Must check each container individually
docker logs mysql-master
docker logs mysql-slave
docker logs phpmyadmin

# Removes containers, networks, and volumes
docker-compose down -v

# Must clean up everything manually
docker stop mysql-master mysql-slave phpmyadmin
docker rm mysql-master mysql-slave phpmyadmin
docker volume rm master-data slave-data
docker network rm mysql-network


chmod +x health-check.sh detailed-status.sh monitor.sh comprehensive-test.sh

# Run comprehensive test
./comprehensive-test.sh

# Monitor in real-time
./monitor.sh

# Check detailed status
./detailed-status.sh