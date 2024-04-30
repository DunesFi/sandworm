#!/bin/bash
# shellcheck disable=SC2129
echo 'run application_start.sh: ' >> /home/ubuntu/DunesFi/sandworm/deploy.log

echo 'pm2 restart sandworm' >> /home/ubuntu/DunesFi/sandworm/deploy.log
pm2 restart sandworm >> /home/ubuntu/DunesFi/sandworm/deploy.log