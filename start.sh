#!/usr/bin/env bash
set -e

npm run dev &
npm run dev:worker &

wait
