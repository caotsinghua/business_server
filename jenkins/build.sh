#!/usr/bin/env sh
echo '开始安装依赖'
set -x
yarn
set +x
echo '安装依赖完成'

echo '开始编译ts'
set -x
npm run build-ts
set +x
echo '编译完成'
