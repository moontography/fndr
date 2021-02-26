# fndr

Password manager that gives you complete control of your account information. fndr supports connectors that can be customized to determine the data store that your accounts are stored in.

## Install

```sh
$ npm install -g fndr
```

## Usage

```sh
$ fndr --help
$
$ fndr add -n facebook -u my.email@gmail.com
$
$ fndr search facebook
$
$ fndr show facebook
$ fndr show facebook -p
$ fndr show IDIDIDIDIDIDID
$
$ fndr delete facebook
$ fndr search facebook
```

## Connectors

- **Jupiter**: Store account information securely on the Jupiter blockchain
