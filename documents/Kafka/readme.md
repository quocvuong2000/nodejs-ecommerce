https://medium.com/@Shamimw/kafka-a-complete-tutorial-part-1-installing-kafka-server-without-zookeeper-kraft-mode-using-6fc60272457f

docker network create kafka-network

docker run -d --name kafkaMQ --network kafka-network \
-e KAFKA_PROCESS_ROLES=broker,controller \
-e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
-e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
-e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \
-e KAFKA_NODE_ID=1 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
-e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
-e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1 \
-e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 \
-p 9092:9092 \
bitnami/kafka:latest