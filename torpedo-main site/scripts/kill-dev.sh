#!/usr/bin/env sh
# Kill processes on ports 3000-3009 and remove Next.js dev lock
for p in 3000 3001 3002 3003 3004 3005 3006 3007 3008 3009; do
  pid=$(lsof -ti :$p 2>/dev/null)
  [ -n "$pid" ] && kill -9 $pid 2>/dev/null
done
rm -rf .next/dev/lock 2>/dev/null
echo Done
