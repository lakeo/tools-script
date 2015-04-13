#!/bin/bash
#init global  variables
JAVA=/usr/local/java/bin/java
LOG_ROOT=/opt/logs/
PORT=8080
$PROJECT=$2
$WEB_ROOT=/opt/apps/$PROJECT
$PROJECT_SOURCE_DIR=/home/lxl/$PROJECT
$SERVICE_DIR=/service/$PROJECT
$PACKAGE=$PROJECT'-1.0-SNAPSHOT.war'


#package
function __package(){
    cd $PROJECT_SOURCE_DIR
    git pull
    mvn package
    cp  target/$PACKAGE $WEB_ROOT/packs
}
#deploy
function __deploy(){
    rm -rf $WEB_ROOT/webroot/
    cp  $WEB_ROOT/packs/$PACKAGE $WEB_ROOT/webroot
    jar xf $WEB_ROOT/webroot/$PACKAGE
    rm $WEB_ROOT/webroot/$PACKAGE
}

#start
function __start() {
    sudo svc -u $SERVICE_DIR
    sudo svstat $SERVICE_DIR
}
#run 
function __run() {
}

#stop
function __stop(){
    echo 'beigin __stop()!'
    sudo svc -d $SERVICE_DIR
}
#main function
function main(){
    case $1 in
        'start')
            echo "start..."
            __start
            ;;
        'run')
            __run
            ;;
        'stop')
            echo "stop..."
            __stop
            ;;
        '*')
            echo "error command ..."
            exit
            ;;
    esac
}
