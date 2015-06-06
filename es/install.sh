#!/bin/bash
set -e

curl -L -O https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.5.2.zip
unzip elasticsearch-1.5.2.zip
cd  elasticsearch-1.5.2

./bin/plugin -i elasticsearch/marvel/latest
echo 'marvel.agent.enabled: false' >> ./config/elasticsearch.yml

./bin/elasticsearch -d
curl 'http://localhost:9200/?pretty'

