#!/bin/bash

SANDWORM_DIR="/home/ubuntu/DunesFi/sandworm/"

# Append starting message to log
echo 'run application_start.sh: ' >> $SANDWORM_DIR/deploy.log

# Log and restart the application, handle errors
echo 'pm2 restart sandworm' >> $SANDWORM_DIR/deploy.log
pm2 restart sandworm >> $SANDWORM_DIR/deploy.log 2>&1 || exit 1
