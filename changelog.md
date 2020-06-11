# Changelog
All notable changes to this project will be documented in this file.

## [2.1.0] - 2020-06-11

### Added
- Added _static_ plugin

### Modified
- _redisproxy_ is now a plugin so it can be enable and disable.
- _notify_ is a separate plugin
- Parameters for plugins are now specified as an array. Check [`IConfig` interface](./src/config.ts) and `spec/plugins/jwt.spec.ts` as reference.

## [2.0.0] - 2020-06-08

### Added
- Fully rewrite using typescript
- Plugin extensibility
- Tests to keep backward compability between minor versions
- Plugins available by now:
    - API (deprecated)
    - JWT Authentication: to authenticate/authorize requests from valid users
    - Compression: to enable compression support
    - Real time proxy: to proxy notifications from redis to socket.io sockets
### Notes:
- You may also load your own plugins, _RestProxyPlugin_ interface is available on [src/plugins/index.ts](./src/plugins/index.ts). You may need to export the class as _default_.

## [1.0.1] - 2017-04-28
### Added
- HTTPS basic support

## [1.0.0] - 2017-04-27

### New
- Release 1.0
