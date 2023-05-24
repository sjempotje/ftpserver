# JavaScript FTP Server

![GitHub license](https://img.shields.io/github/license/sjempotje/ftpserver?style=for-the-badge)

This is a simple JavaScript FTP server without SSL support. It can be used to run an FTP server on localhost or on a network.

## Prerequisites

You need to have [Node.js](https://nodejs.org/en/) installed on your machine to run this project.

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/sjempotje/ftpserver.git
   ```

2. Install the dependencies:

   ```sh
   cd ftpserver
   npm install
   ```
3. Create a `.env` file in the root directory of the project and add the following options:

   ```
   IP=192.168.2.13 #ip of your machine
   PORT=1234 #port to access ftp
   BART_PWD=myBartPassword #add per user a password like example + _PWD = example_PWD
   ADMIN_PWD=myAdminPassword
   ```
## Usage

1. Start the server:

   ```sh
   npm start
   ```

2. Connect to the server using an FTP client on your machine.

3. Enter the host IP address and port number in your FTP client settings:

   ```
   Host: localhost (or your IP address if running on a network)
   Port: 21
   ```

4. Enter a username and password
   ```
   Name: example
   Password example_PWD
   ```


That is everything for now!