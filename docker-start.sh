#!/bin/sh
# Runs the two processes of the image: the Node server for /api/ (the lead
# store) and nginx for everything else. A shell as PID 1 ignores signals it
# has no trap for, so the trap catches docker stop - SIGQUIT, the nginx base
# image's STOPSIGNAL, or SIGTERM/SIGINT - and stops both. When either process
# ends on its own, the other is stopped and the container exits with 1, so
# Dokploy restarts it instead of nginx answering 502 forever.
#
# BusyBox `wait -n` does not return when a child is killed by a signal, so
# the shell checks both every second instead; `sleep 1 & wait` keeps that
# check interruptible, so docker stop is handled at once.

node /app/dist/server/entry.mjs &
node_pid=$!
nginx -g 'daemon off;' &
nginx_pid=$!

stopping=0
trap 'stopping=1' TERM INT QUIT

while [ "$stopping" = 0 ] &&
  kill -0 "$node_pid" 2>/dev/null &&
  kill -0 "$nginx_pid" 2>/dev/null; do
  sleep 1 &
  wait $!
done

kill -TERM "$node_pid" "$nginx_pid" 2>/dev/null
wait
[ "$stopping" = 1 ] && exit 0
echo "[docker-start] node or nginx exited, stopping the container" >&2
exit 1
