SOCIAL SHARE
=================
A simple way to use Facebook API in an app for send images for your Facebook timeline.

This app run WITHOUT BACKEND (Showing the power of Frontend)!

### How to Use

1 - Clone this repository and access the generated folder

```bash
$ git clone git@github.com:willmendesneto/social-share.git [project-name]
$ cd [project-name]
```

2 - Run the commands for download application dependencies

```bash
$ npm install #install node dependencies
$ bower install #install bower dependencies
```

OBS: To verify if all modules that this app has dependency are installed. The list of all them are in package.json file.

3 - Run grunt serve command for run local server command
```bash
$ grunt server
```

After this, access http://0.0.0.0:9000 for use this app

6 - Build application
```bash
$ grunt
```

7 - Run server based in dist folder
```bash
$ grunt server:dist
```

## 3rd party dependencies ##

This project use (actually globally):

###NodeJS
- ```grunt-cli``` for run grunt commands in CLI;
- ```bower``` like package manager for the web;
- ```jshint``` for lint script files;

###Frontend

All list of frontend dependencies are in ```bower.json``` and/or ```package.json``` files.
