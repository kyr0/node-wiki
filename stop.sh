#!/bin/sh

# Stop node-wiki process
kill $(ps aux | grep '[node]-wiki' | awk '{print $2}') > /tmp/node-wiki-stopping 2> /tmp/node-wiki-stopping < /dev/null
stopLine=`cat /tmp/node-wiki-stopping | wc -l | tr -d ' '`

if [ $stopLine -eq 0 ]; then
    echo "OK: node-wiki process(es) stopped."
    else
    echo "FAIL: No node-wiki processes found. Nothing stopped."
fi

# Cleanup
rm /tmp/node-wiki-stopping