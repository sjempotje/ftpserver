const ftpd = require('@svrooij/ftpd')
const fs = require('fs')
const path = require('path')
const express = require('express');

require('dotenv').config()

const app = express();
app.use(express.static('public'));

var keyFile
var certFile
var server

// use the IP and PORT from the .env file or default to localhost:21
var options = {
  host: process.env.IP || '127.0.0.1',
  port: process.env.PORT || 21,
  tls: null,
}

const usernames = ["bart","admin","example"];

// get ftp root directory listing
server = new ftpd.FtpServer(options.host, {
  getInitialCwd: function () {
    return '/'
  },
  getRoot: function (connection) {
    console.log('session username', connection.session.username)
    console.log('connecting to folder' + process.cwd())
    const fullPath = path.join(__dirname + '/public/' + connection.session.username)
    console.log('fullPath', fullPath)
    //check if folder exists
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath)
    }
    console.log('fullPath', fullPath)
    return fullPath
  },
  pasvPortRangeStart: 1025,
  pasvPortRangeEnd: 1050,
  tlsOptions: options.tls,
  allowUnauthorizedTls: true,
  useWriteFile: false,
  useReadFile: false,
  uploadMaxSlurpSize: 7000, // N/A unless 'useWriteFile' is true.
  allowedCommands: [
    'XMKD',
    'AUTH',
    'TLS',
    'SSL',
    'USER',
    'PASS',
    'PWD',
    'OPTS',
    'TYPE',
    'PORT',
    'PASV',
    'LIST',
    'CWD',
    'MKD',
    'SIZE',
    'STOR',
    'MDTM',
    'DELE',
    'QUIT',
    'RETR',
  ],
})

server.on('error', function (error) {
  console.log('FTP Server error:', error)
})

// verify user and password from .env file
server.on('client:connected', function (connection) {
    console.log('client connected: ' + connection.remoteAddress);
  
    // initialize connection session
    connection.session = {};
  
    connection.on('command:user', function (user, success, failure) {
      if (user && usernames.includes(user)) {
        connection.session.username = user;
        console.log('user ' + user + ' logged in');
        success();
      } else {
        failure();
      }
    });
  
    connection.on('command:pass', function (pass, success, failure) {
      if (process.env[connection.session.username + '_PWD']) {
        success(connection.session.username);
      } else {
        failure();
      }
    });
  });

server.debugging = 4
server.listen(options.port)
console.log('Listening on port ' + options.port)


// Serve the files

app.listen(3000, () => {
  console.log('App listening on http://localhost:3000')
}
);

//make a new get for every folder in the public folder
fs.readdirSync('./public').forEach(folder => {
  console.log('folder', folder)
  app.get('/' + folder, (req, res) => {
    //send every file in the folder
    fs.readdirSync('./public/' + folder).forEach(file => {
      console.log('file', file)
      res.write('<a href="/' + folder + '/' + file + '">' + file + '</a><br>')
    }
    )
    res.end()
  })
}
)