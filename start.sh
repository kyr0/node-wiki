#!/bin/sh

# Create directory if not existing silently
mkdir log > /dev/null 2> /dev/null < /dev/null &

echo "Starting node-wiki process..."

# Start node-wiki process as daemon (UNIX/Linux-system specific)
nohup node node-wiki.js > log/node-wiki.out 2> log/node-wiki.err < /dev/null &
