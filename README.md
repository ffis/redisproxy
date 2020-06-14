# redisproxy

This is a simple redis proxy intented to server a jsonp access or an socket-io real time proxy.

Check the code before using it on a production environment or at least don't deploy it outside of the DMZ
nor having the redis any kind of confidencial information.


## Installation

```bash
git clone https://github.com/ffis/redisproxy.git
cd redisproxy
npm install
``` 

Duplicate _config-example.json_ and rename to _config.json_ configure redis connection parameters.

## Active desired plugins

_Redisproxy_ is based on different plugins, you may need to activate in order to obtain the desired behavior.
The in-built plugins are:
- _api_: Adds and `/api` endpoint that lists what _keys_ are available on redis server.
- _compression_: Adds compression to all HTTP requests and responses.
- _cors_: Enables CORS to HTTP requests.\*
- _jwt_: Adds authentication verification via _Authorization_ header. It expects that starts with 'Bearer ' string.\*
- _notify_: Sends a notification via http to an HTTP/s server that the request has been made.
- _realtimeproxy_: Proxies messages from a redis channel to sockets connected via _socket.io_.
- _redisproxy_: Exposes redis content as readonly using _GET_ method.
- _static_: Exposes a file directory.\*

\*: You may need to configure this plugin in order to work.

Note:
- some plugins like _static_ can be selected more than once.
- some plugins should be used with caution and always with an authentication/authorization service like _jwt_.



## Check Redis is working

Suppose the Redis server is configured on host 127.0.0.1, then run this script on terminal:

```bash
    wget https://github.com/crypt1d/redi.sh/raw/master/redi.sh
    echo "this is a variable" | bash redi.sh -s testvar -H 127.0.0.1
    bash redi.sh -g testvar -H 127.0.0.1
    If you can read "this is a variable" then everything is ok.
```

## Run the application

```bash
npm start
```

## Run tests and calculate code coverage

```bash
npm run coverage
```