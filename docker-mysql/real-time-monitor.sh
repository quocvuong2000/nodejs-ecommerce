#!/bin/bash

echo "📡 REAL-TIME REPLICATION MONITORING"
echo "==================================="

while true; do
    clear
    echo "⏰ $(date)"
    echo "==================="

    # Master status
    echo "📤 MASTER:"
    docker exec mysql-master mysql -uroot -prootpassword -e "SHOW MASTER STATUS;" 2>/dev/null | tail -n +2

    echo ""
    echo "📥 SLAVE:"
    # Slave status
    SLAVE_STATUS=$(docker exec mysql-slave mysql -uroot -prootpassword -e "SHOW SLAVE STATUS\G" 2>/dev/null)

    echo "   IO Thread:  $(echo "$SLAVE_STATUS" | grep "Slave_IO_Running:" | awk '{print $2}')"
    echo "   SQL Thread: $(echo "$SLAVE_STATUS" | grep "Slave_SQL_Running:" | awk '{print $2}')"
    echo "   Lag:        $(echo "$SLAVE_STATUS" | grep "Seconds_Behind_Master:" | awk '{print $2}') seconds"

    echo ""
    echo "📊 RECORD COUNT:"
    MASTER_COUNT=$(docker exec mysql-master mysql -uroot -prootpassword -e "SELECT COUNT(*) FROM testdb.users;" 2>/dev/null | tail -n +2)
    SLAVE_COUNT=$(docker exec mysql-slave mysql -uroot -prootpassword -e "SELECT COUNT(*) FROM testdb.users;" 2>/dev/null | tail -n +2)

    echo "   Master: $MASTER_COUNT records"
    echo "   Slave:  $SLAVE_COUNT records"

    if [ "$MASTER_COUNT" = "$SLAVE_COUNT" ]; then
        echo "   Status: ✅ IN SYNC"
    else
        echo "   Status: ⚠️  OUT OF SYNC"
    fi

    echo ""
    echo "Press Ctrl+C to exit..."
    sleep 3
done