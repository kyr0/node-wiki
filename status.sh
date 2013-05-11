#!/bin/sh

processLine=`ps aux | grep "node-wiki.js" > /tmp/node-wiki-status`
processCount=`cat /tmp/node-wiki-status | wc -l | tr -d ' '`
processCount=$((processCount-1))

if [ -n processCount ]; then

    echo $processCount "node-wiki process(es) up and running".

fi

# Cleanup
rm /tmp/node-wiki-status