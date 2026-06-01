#!/usr/bin/env bash

HOST=localhost:3030


echo ----------
echo START


echo ----------
echo GET /becho
curl -v $HOST/becho


echo ----------
echo POST /becho
curl -v --data-raw "boddyyaddy" $HOST/becho



echo ----------
echo GET /store
curl -v $HOST/store


echo ----------
echo POST /store
curl -v --data-raw "{data:[]}" $HOST/store





echo ----------
echo END
