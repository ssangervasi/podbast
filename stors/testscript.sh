#!/usr/bin/env bash

HOST=localhost:3030


echo ----------
echo START


echo ----------
echo GET /info
curl -v $HOST/info


echo ----------
echo POST /echo
curl -v \
	--data-raw "!
boddy
yaddy
yaddy
yaddy
yaddy
!" \
	$HOST/echo?convert=CAPS



# echo ----------
# echo GET /store
# curl -v $HOST/store


# echo ----------
# echo POST /store
# curl -v --data-raw "{data:[]}" $HOST/store





echo ----------
echo END
