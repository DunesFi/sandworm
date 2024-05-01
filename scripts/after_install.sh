#!/bin/bash
echo 'run after_install.sh: ' >> ~/DunesFi/sandworm/deploy.log

echo 'cd ~/DunesFi/sandworm' >> ~/DunesFi/sandworm/deploy.log
cd ~/DunesFi/sandworm >> ~/DunesFi/sandworm/deploy.log || exit

echo 'bun install' >> ~/DunesFi/sandworm/deploy.log
bun install >> ~/DunesFi/sandworm/deploy.log
