Installation steps for Crypto Server and the client
=================================================================
This solution is tested with Win10 and CentOS7 system. Port used in 8443.
Hence, make sure that your firewall is not blocking the port.
If you want to change the port, please change the port in following files
-  server/server.js
-  client/client.js

All certificates and keys needed is part of the package and there is no need
of recreating the keys. If you are interested to use different key strength, 
please refer Wiki page for key generation using OpenSSL.

Pre-requisite:
--------------

1) Install Node.js
2) Install npm
3) Install OpenSSL

Installation Steps:
-------------------

1) Open the terminal
2) Run the below command to install all dependencies. 
  server/package.json has all required modules.
  > npm update
3) Run RESTful server with the below command
  > node server.js
4) Open command prompt and go to CryptoSolution/Server. Run HTTP client with the below command
  > node client/client.js



