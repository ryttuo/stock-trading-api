#!/bin/sh

REQUIRED_NODE_VERSION="20.19.0"
CURRENT_NODE_VERSION=$(node -v | cut -d 'v' -f 2)

if [ "$CURRENT_NODE_VERSION" != "$REQUIRED_NODE_VERSION" ]; then
  echo "Error: Node version must be $REQUIRED_NODE_VERSION"
  echo "Current version: $CURRENT_NODE_VERSION"
  exit 1
fi 