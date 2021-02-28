# fndr

Flexible and secure (AES-256 bit encryption) password manager that gives you complete control of your account information. fndr supports customized connectors that tell fndr where to store your encrypted account information.

The default connector is the [filesystem connector](#filesystem-default) that encrypts and stores account information on your local file system.

## Highlight: Jupiter blockchain connector

The [Jupiter connector](#jupiter) supports storing your accounts on chain in a decentralized and secure manner using AES encryption on the Jupiter blockchain.

## Note on >=0.1.0 breaking change

Prior to v0.1.0 the default connector was the [`jupiter`](#jupiter) connector. Now the default connector is `filesystem`, so if upgrade to >=0.1.0 you need to run the following command to use the `jupiter` connector.

```sh
$ fndr use -c jupiter
```

## Requirements

[Node.js](https://nodejs.org/en/), ideally the LTS version, and NPM installed (NPM get's shipped with a fresh Node.js install)

## Install

```sh
$ npm install -g fndr
```

If successful, you should be able to get the fndr version:

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

$ # get current connector being used
$ fndr connector
filesystem

$ # setup fndr to use a particular connector (DEFAULT is 'filesystem')
$ fndr use -c jupiter
Successfully changed connector to 'jupiter'!

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

$ # with the `-P` (capital P) parameter, only show the password for command piping support
$ fndr show -n facebook -P
thePassword

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

$ # delete an account from the fndr database (requires entering the ID)
$ fndr delete -i 7cc821a0-7866-11eb-9e3a-6725a812df0e
Successfully deleted account: '7cc821a0-7866-11eb-9e3a-6725a812df0e'.

$ # export all your accounts on your machine in a JSON file.
$ # THIS CONTAINS ALL YOUR ACCOUNTS AND PASSWORDS UNENCRYPTED SO BE CAREFUL WHAT YOU DO WITH THIS
$ fndr export
You're export was created in the following location.
NOTE: this contains your account information unencrypted so keep it in a safe place!

/Users/moontography/.fndr/export_1614540410.json

```

## Connectors

Connectors are interfaces that support storing your encrypted account information in different data sources. This could range from a blockchain, SQL database, Redis, your file system, etc. The possibilities are endless, and you can refer to the types to understand the interface needed to build your own connector(s).

### `filesystem` (default)

Store account information securely on your machine that is AES-256 bit encrypted with a secret you provide. When running fndr for the first time, you'll be prompted to enter a secret/password that will be used to encrypt your data. Do not lose this secret in case you need to recover your passwords later!

```sh
$ fndr use -c filesystem
```

### `jupiter`

Store account information securely on the Jupiter blockchain.

```sh
$ fndr use -c jupiter
```

#### Requirements

- A funded [Jupiter blockchain](https://gojupiter.tech/) address (JUP-XXX-XXX...)
  - _When we say "funded", we mean you need a VERY TINY amount of JUP in this address. We attempt to fund a newly created account that will be used to store transactions with your encrypted account data with 0.0005 JUP (50000 NQT), which as of the time of writing is fractions of a cent in USD._

### We want your ideas and PRs for new connectors!

#### TODO

Today if you've been using a connector and would like to switch to a different one, your accounts are not ported over to the new connector. We will add this functionality soon.

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

## Quick Note

fndr with the `filesystem` connector is basically a rebuild of [hide](https://github.com/whatl3y/hide) password manager. I'm still decided whether to rename this repo back to `hide` and provide clear migration steps from it or leave fndr alone, I haven't really decided yet :)

# Tips w/ cryptocurrency

I love FOSS (free and open source software) and for the most part don't want to charge for the software I build. It does however take a good bit of time keeping up with feature requests and bug fixes, so if you have the desire and ability to send me a free coffee, it would be greatly appreciated!

- Bitcoin (BTC): `3D779dP5SZo4szHivWHyFd6J2ESumwDmph`
- Ethereum (ETH and ERC-20 tokens): `0xF3ffa9706b3264EDd1DAa93D5F5D70C8f71fAc99`
- Stellar (XLM): `GACH6YMYFZ574FSGCV7IJXTGETEQL3DLQK64Z6DFGD57PZL5RH6LYOJT`
- Jupiter (JUP) mainnet: `JUP-TUWZ-4B8Z-9REP-2YVH5`
