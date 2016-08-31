#!/bin/bash

if [ ! -d "redis-stable" ]; then 
    echo "POST-INSTALL: Downloading, unpacking, and building redis locally."
    mkdir tmp; cd tmp;
    curl "http://download.redis.io/releases/redis-stable.tar.gz" -o "redis-stable.tar.gz"
    tar xzf redis-stable.tar.gz --directory ../
    cd ../; rm -rf tmp;
    cd redis-stable
    make
fi