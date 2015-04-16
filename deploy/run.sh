#!/bin/bash
#init global  variables
JAVA=$JAVA_HOME
LOG_ROOT=/opt/logs/
PORT=8080
JETTY_HOME=/usr/local/jetty9.1
JETTY_BASE=$JETTY_HOME
JETTY_RUN=$JETTY_BASE
JETTY_USER=www
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
    JAVA_OPTIONS="-Xloggc:/opt/log/gc.log 
    -XX:+PrintGCDetails -XX:+PrintGCDateStamps 
    -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 
    -XX:GCLogFileSize=10M -XX:+UseG1GC -XX:+UnlockExperimentalVMOptions 
    -server 
    -XX:+UnlockCommercialFeatures -XX:+FlightRecorder -XX:+HeapDumpOnOutOfMemoryError 
    -XX:HeapDumpPath=/opt/log/oom.log
    -Djetty.webroot=$WEB_ROOT/webroot
    -Djetty.logs=$LOG_ROOT
    -Djetty.context=/
    "

    JAVA_SIZE="-XX:G1MaxNewSizePercent=50 -XX:PermSize=256m -XX:MaxPermSize=256m -Xss256k -Xms512m -Xmx512m";
    JAVA_GC="-XX:+DisableExplicitGC -XX:+PrintGCDetails 
    -XX:+PrintHeapAtGC -XX:+PrintTenuringDistribution 
    -XX:CMSFullGCsBeforeCompaction=0 -XX:+UseCMSCompactAtFullCollection -XX:CMSInitiatingOccupancyFraction=80
    -XX:+UseConcMarkSweepGC -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps"


    cd $WEB_ROOT/webroot
    CLASSPATH=WEB-INF/classes
    for i in WEB-INF/lib/*
    do
        CLASSPATH=$CLASSPATH:$i
    done

    export CLASSPATH

    EXEC="exec $JAVA_OPTIONS $JAVA_SIZE $JAVA_GC"

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
