#!/bin/bash

SANDWORM_DIR="/home/ubuntu/DunesFi/sandworm/"

# Append starting message to log
echo 'run after_install.sh: ' >> $SANDWORM_DIR/deploy.log

# Log and change directory, handle errors
echo 'cd /home/ubuntu/DunesFi/sandworm' >> $SANDWORM_DIR/deploy.log
cd /home/ubuntu/DunesFi/sandworm >> $SANDWORM_DIR/deploy.log 2>&1 || exit 1

# Log and upgrade packages, handle errors
echo 'bun upgrade' >> $SANDWORM_DIR/deploy.log
bun upgrade >> $SANDWORM_DIR/deploy.log 2>&1 || exit 1

# Log and install packages, handle errors
echo 'bun install' >> $SANDWORM_DIR/deploy.log
bun install >> $SANDWORM_DIR/deploy.log 2>&1 || exit 1
