# redisproxy

This is a simple redis proxy intented to server a jsonp access.

Note this service has a not to strong CAS validation.
Check the code before using it on a production environment or at least don't deploy it outside of the DMZ
nor having the redis any kind of confidencial information.

## Installation


```bash

git clone https://github.com/ffis/redisproxy
cd redisproxy
npm install

``` 

Duplicate _config-example.json_ and rename to _config.json_ configure redis connection parameters.

## Check Redis is working

Suppose the Redis server is configured on host 127.0.0.1, then run this script:

```bash
$ wget https://github.com/crypt1d/redi.sh/raw/master/redi.sh
$ echo "this is a variable" | bash redi.sh -s testvar -H 127.0.0.1
$ bash redi.sh -g testvar -H 127.0.0.1
# If you can read "this is a variable" then everything is ok.
```

