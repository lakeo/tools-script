#!/bin/sh

## you'll have to do a couple extra steps to get this running
## there are probably other ways to handle svncanboot, but this is from the linux forum

set -e

if
    touch /etc/_testr_file
then
    rm -f /etc/_testr_file
else
    echo "error, you have to be able to write to /etc"
    exit 1
fi

BASE_DIR=`pwd`

apt-get -y install daemontools

# for some reason, /etc/service isn't created, need to do that.
mkdir -p /etc/service

# need to make a conf file for booting
cd /etc/init/
touch svscan.conf

# treat like the cron process

echo "start on runlevel [2345]" > svscan.conf
echo "" >> svscan.conf
echo "expect fork" >> svscan.conf
echo "respawn" >> svscan.conf
echo "exec svscanboot" >> svscan.conf

service svscan start
echo "complete"
cd $BASE_DIR
