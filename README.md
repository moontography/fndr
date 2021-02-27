# fndr

Flexible and secure password manager that gives you complete control of your account information. fndr supports customized connectors that determine where to store your account information.

The default connector is the [Jupiter connector](#jupiter-default) that encrypts and stores account information on the Jupiter blockchain.

## Requirements

[Node.js](https://nodejs.org/en/), preferrably the current LTS version, and NPM installed (NPM get's shipped with a fresh Node.js install)

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
$ # Display all help text on how to use fndr
$ fndr --help
$
$ # setup configuration for fndr based on the connector(s) you're using
$ # for the default Jupiter connector, see below for requirements to get started
$ fndr config
$
$ # find the location of the config file
$ fndr file
Your configuration file is in the following location:
/Users/moontology/.fndr/jupiter.json

$
$ # add new facebook account
$ fndr add -n facebook -u my.email@gmail.com
? The password for account: facebook. [hidden] [input is hidden]
Successfully added account 'facebook'!

$ # search for your new facebook account with a search query (-q)
$ fndr search -q facebook
I found the following accounts:
ID                                   NAME            USERNAME
7cc821a0-7866-11eb-9e3a-6725a812df0e facebook        my.email@gmail.com
1 of 3 total accounts returned

$ # show only your facebook account. Needs the exact name with `-n` provided
$ # or the ID with a `-i` provided
$ fndr show -n facebook
ID                                   NAME
7cc821a0-7866-11eb-9e3a-6725a812df0e facebook

$ # with the `-p` parameter, also show the password in the terminal window
$ fndr show -n facebook -p
ID                                   NAME            PASSWORD
7cc821a0-7866-11eb-9e3a-6725a812df0e facebook        thePassword

$ # find account by ID
$ fndr show -i 7cc821a0-7866-11eb-9e3a-6725a812df0e
ID                                   NAME
7cc821a0-7866-11eb-9e3a-6725a812df0e facebook

$ # without a query (`-q`) in search, pull down ALL accounts
$ # (search never displays passwords)
$ fndr search
I found the following accounts:
ID                                   NAME            USERNAME             EXTRA
7cc821a0-7866-11eb-9e3a-6725a812df0e facebook        my.email@gmail.com
0de634c0-7866-11eb-9676-b1f9506d8872 theAccount
6e3d6640-7870-11eb-95dc-014f038856e7 instagram       moontology           some extra text provided
3 of 3 total accounts returned

$ # update an existing account
$ node dist/fndr update -n facebook -e "this is my main account"
? The password for account (leave blank if unchanged): facebook. [hidden]

Successfully updated account: 'facebook'!

$ # delete an account from the fndr database (can delete by account name or ID)
$ fndr delete -n facebook
$ fndr delete -i 7cc821a0-7866-11eb-9e3a-6725a812df0e
Successfully deleted account: '7cc821a0-7866-11eb-9e3a-6725a812df0e'.

```

## Connectors

Connectors are interfaces that support storing your encrypted account information in different data sources. This could range from a blockchain, SQL database, Redis, your file system, etc. The possibilities are endless, and you can refer to the types to understand the interface needed to build your own connector(s).

### Jupiter (default)

Store account information securely on the Jupiter blockchain.

#### Requirements

- A funded [Jupiter blockchain](https://gojupiter.tech/) address (JUP-XXX-XXX...)
  - _When we say "funded", we mean you need a VERY TINY amount of JUP in this address. We attempt to fund a newly created account that will be used to store transactions with your encrypted account data with 0.0005 JUP (50000 NQT), which as of the time of writing is fractions of a cent in USD._

### We want your ideas and PRs for new connectors!

## Development

I'd love for you to contribute to the project! Use the steps below to pull down the source code and build, and feel free to create PRs as you'd like.

All PRs need to passing tests that test any additions or changes to existing code.

```sh
$ git clone https://github.com/whatl3y/fndr
$ cd fndr
$ npm install
$
$ # run tests
$ npm test
$
$ # build app (also run this after making changes to source code)
$ npm run build
$
$ # now you can run commands with the locally built entry point
$ # example:
$ node dist/fndr search -q facebook
```
