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


store_get() {
	curl -vv -H "X-Req-N: $1", $HOST/store
}

store_get_n() {
	n=$1
	
	for i in $(eval echo {1..$n}); do
		(
			echo "req #$i"
			store_get $i
		)&
	done
}

store_get_n 5

# echo ----------
# echo POST /store
# curl -v --data-raw "{data:[]}" $HOST/store





echo ----------
echo END
