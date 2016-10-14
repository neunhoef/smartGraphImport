#!/bin/sh
arangosh --server.endpoint $1 --server.username root --server.password '' --javascript.execute /dowork.js

