# fndr

Flexible and secure password manager that gives you complete control of your account information. fndr supports connectors that can be customized to store your account information the data store that your accounts are stored in.

## Requirements

- [Node.js](https://nodejs.org/en/), preferrably the current LTS version, and NPM installed (NPM get's shipped with a fresh Node.js install)

## Install

```sh
$ npm install -g fndr
```

If installed successfully, you should be able to get the fndr version:

```sh
$ fndr -v
0.0.1
```

## Usage

```sh
$ # Display help on how to use fndr
$ fndr --help
$
$ fndr add -n facebook -u my.email@gmail.com
? The password for account: facebook. [hidden] [input is hidden]

Successfully added account 'facebook'!

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

Connectors are interfaces that support storing your encrypted account information in different data sources. This could range from a blockchain, SQL database, Redis, your file system, etc. The possibilities are endless, and you can refer to the types to understand the interface needed to build your own connector(s).

### Jupiter (default)

Store account information securely on the Jupiter blockchain

#### Requirements

- A funded [Jupiter blockchain](https://gojupiter.tech/) address (JUP-XXX-XXX...)
  - _When we say "funded", you need a TINY amount of JUP in this address. We attempt to fund a newly created account that will be used to store transactions with your encrypted account data with 0.0005 JUP (50000 NQT), which as of the time of writing is fractions of a cent in USD._

### _We want your ideas and PRs for new connectors!_
