#!/bin/bash
# shellcheck disable=SC2129
echo 'run application_start.sh: ' >> ~/DunesFi/sandworm/deploy.log

echo 'pm2 restart sandworm' >> ~/DunesFi/sandworm/deploy.log
pm2 restart sandworm >> ~/DunesFi/sandworm/deploy.log