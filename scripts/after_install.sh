#!/bin/bash
echo 'run after_install.sh: ' >> /home/ubuntu/DunesFi/sandworm/deploy.log

echo 'cd /home/ubuntu/DunesFi/sandworm' >> /home/ubuntu/DunesFi/sandworm/deploy.log
cd /home/ubuntu/DunesFi/sandworm >> /home/ubuntu/DunesFi/sandworm/deploy.log || exit

echo 'bun install' >> /home/ubuntu/DunesFi/sandworm/deploy.log
bun install >> /home/ubuntu/DunesFi/sandworm/deploy.log
