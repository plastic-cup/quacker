
[![bitHound Score](https://www.bithound.io/github/plastic-cup/quacker/badges/score.svg)](https://www.bithound.io/github/plastic-cup/quacker/master) ![Build Status](https://travis-ci.org/plastic-cup/quacker.svg?branch=master) [![Code Climate](https://codeclimate.com/github/plastic-cup/quacker/badges/gpa.svg)](https://codeclimate.com/github/plastic-cup/quacker) <a href="https://codeclimate.com/github/plastic-cup/quacker/coverage"><img src="https://codeclimate.com/github/plastic-cup/quacker/badges/coverage.svg" /></a> ![Build](https://david-dm.org/plastic-cup/quacker.svg) [![David](https://img.shields.io/david/dev/strongloop/express.svg)](https://github.com/plastic-cup/quacker)

# Quacker
A NEW AND REVOLUTIONARY IDEA

## Why

To get rich! Also, as a side effect, to learn endpoint handling. We are going to keep our code modular and get experience routing requests to create a CR-D application.

We want to make an app that's good for publishing short thoughts and seeing other people's. Can't believe no one's thought of it yet.

## What

  + [x] An app with Create, Read and Delete endpoints

  + [x] Quax will be persistently available

  + [x] Some authentication process
    + [x] Cookies

  + [ ] LIVE on HEROKU! Quack.

  + [x] Real-time quack updates


## How

### How to run & test it

We are currently not on a tight publishing schedule on NPM. Therefore, we suggest cloning this repo and running `npm install` in the directory to install all dependencies and dev-dependencies. To run the app, hit `npm run start`. You can then check us out on `localhost:8000`. You won't see a lot at the moment. The good stuff is in the tests. We tend to be several failing tests ahead of our functionality. To see the latest failing tests, `git checkout thorough-tests`. Have a look in our test file to see the guts. `npm test` to see the output.

There are several cool things to checkout in the test file:
  + A function we wrote to keep the tests running after the first failed assertion
  + A function we wrote to spoof HTTP request and responses
  + A lot of uses of the `call` and `apply` function methods
  + Passing the tests as the `next` function to the endpoint, so it calls the tests when it's finished.

### How it's made
  + [x] CR-D accessed using HTTP `POST`, `GET` and `DELETE` respectively.

  + Quax will be stored in Redis.
    + [x] Stored in memory
    + [x] Stored in file system
    + [x] Stored in Redis
