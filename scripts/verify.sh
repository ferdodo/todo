#!/bin/sh
set -e

if test -t 0; then
  INTERACTIVE=""
else
  INTERACTIVE="-T"
fi

verify() {
  docker compose run $INTERACTIVE --rm --build --quiet-build --remove-orphans "$1" npm run verify
}

verify core
verify ui
verify front
verify browser
