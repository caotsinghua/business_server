#!/usr/bin/env sh

echo '准备执行dist/app.js'
set -x
npm run start-dist
set +x
echo '执行完毕'
