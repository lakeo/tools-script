#!/bin/bash

set -e

sudo bash
su -

#ini bash
export PATH=/usr/local/bin:$PATH
export LC_ALL=zh_CN.UTF-8
export LANG=zh_CN.UTF-8

#download m4
curl -O -L http://mirrors.kernel.org/gnu/m4/m4-1.4.13.tar.gz
tar -xzvf m4-1.4.13.tar.gz
cd m4-1.4.13
./configure --prefix=/usr/local
make && make install
cd ..

#download autoconf
curl -O -L http://mirrors.kernel.org/gnu/autoconf/autoconf-2.65.tar.gz
tar -xzvf autoconf-2.65.tar.gz
cd autoconf-2.65
./configure --prefix=/usr/local
make && make install
cd ..

#download automake
curl -O -L http://mirrors.kernel.org/gnu/automake/automake-1.11.tar.gz
tar xzvf automake-1.11.tar.gz
cd automake-1.11
./configure --prefix=/usr/local
make && make install
cd ..

#download libtool
 curl -O -L http://mirrors.kernel.org/gnu/libtool/libtool-2.2.6b.tar.gz
tar xzvf libtool-2.2.6b.tar.gz
cd libtool-2.2.6b
./configure --prefix=/usr/local
make && make install
cd ..

#download seekcore
curl -O -L http://www.coreseek.cn/uploads/csft/3.2/coreseek-3.2.14.tar.gz
tar xzvf coreseek-3.2.14.tar.gz
cd coreseek-3.2.14

cd mmseg-3.2.14
./bootstrap
./configure --prefix=/usr/local/mmseg3
make && make install
cd ..

cd csft-3.2.14
 sh buildconf.sh
./configure --prefix=/usr/local/coreseek  --without-unixodbc --with-mmseg --with-mmseg-includes=/usr/local/mmseg3/include/mmseg/ --with-mmseg-libs=/usr/local/mmseg3/lib/ --with-mysql --with-mysql-includes=/usr/local/mysql-5.6.24-osx10.8-x86_64/include --with-mysql-libs=/usr/local/mysql-5.6.24-osx10.8-x86_64/lib
make && make install
cd ..

cd testpack
cat var/test/test.xml
/usr/local/mmseg3/bin/mmseg -d /usr/local/mmseg3/etc var/test/test.xml
/usr/local/coreseek/bin/indexer -c etc/csft.conf --all
/usr/local/coreseek/bin/search -c etc/csft.conf
