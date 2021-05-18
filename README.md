To run this the backend, you need to download and install [NodeJS](https://nodejs.org/en/download/),[MongoDB Community Server](https://www.mongodb.com/try/download/community) and [MongoDB Compass](https://www.mongodb.com/products/compass).

1. Fork a copy of the project for your own profile.
2. Git clone the project to your local directory.
3. Inside the directory in which the project has been cloned, run `cd Password-Manager/API && node app.js` to run the backend.
4. A server will be started on `localhost:5000`.
5. The backend will start running inside the command line window. Closing the window will shut the server.

To test the responses on the backend, use curl or some software like Insomnia or Postman. 

The paths are defined in the routes file within `Password-Manager/API/routes`. Use that to navigate your way around the app. A more detailed description of the routes will be added in a readme later within the subdirectory `Password-Manager/API/routes`.

Note that changes to the code will not be reflected until a server restart takes place. To resolve this, run `npm install -g nodemon` to install Nodemon globally. Nodemon instantly refreshes the server every time a code change takes place. 