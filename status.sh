#!/bin/sh

echo
echo node-wiki status:
echo

processLine=`ps aux | grep "node-wiki.js" > /tmp/node-wiki-status`
processCount=`cat /tmp/node-wiki-status | wc -l | tr -d ' '`
processCount=$((processCount-1))

if [ -n processCount ]; then

    echo $processCount "node-wiki process(es) up and running".

    echo

    echo Recent log entries:
    tail -n 20 log/node-wiki.out

    echo

    echo Recent error log entries:
    tail -n 20 log/node-wiki.err

fi

# Cleanup
rm /tmp/node-wiki-status