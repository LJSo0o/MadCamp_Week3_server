// import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');
const mongoose = require('mongoose')//mongoose define

// Firebase setup
const firebaseAdmin = require('firebase-admin');
// you should manually put your service-account.json in the same folder app.js// is located at.
const serviceAccount = require('./madcamp-bunsilmul-firebase-adminsdk-xsatg-ae7e18520e.json');

// Kakao API request url to retrieve user profile based on access token
const requestMeUrl = 'https://kapi.kakao.com/v2/user/me';

// Initialize FirebaseApp with service-account.json
firebaseAdmin.initializeApp({ 
  credential: firebaseAdmin.credential.cert(serviceAccount),
});


/** 
 * requestMe - Returns user profile from Kakao API 
 * 
 * @param {String} kakaoAccessToken Access token retrieved by Kakao Login API
 * @return {Promiise<Response>} User profile response in a promise 
 */
function requestMe(kakaoAccessToken) { 
  console.log('Requesting user profile from Kakao API server.'); 
  return request({ 
    method: 'GET', 
    headers: {'Authorization': 'Bearer ' + kakaoAccessToken}, 
    url: requestMeUrl, 
  });
};

/** 
 * updateOrCreateUser - Update Firebase user with the give email, create if 
 * none exists. 
 * 
 * @param {String} userId user id per app 
 * @param {String} email user's email address 
 * @param {String} displayName user 
 * @param {String} photoURL profile photo url 
 * @return {Prommise<UserRecord>} Firebase user record in a promise 
 */
function updateOrCreateUser(userId, email, displayName, photoURL) { 
  console.log('updating or creating a firebase user'); 
  const updateParams = { provider: 'KAKAO', displayName: displayName, photoURL: photoURL, 
  }; 
  if (photoURL) { updateParams['photoURL'] = photoURL; 
  } 
  return firebaseAdmin.auth().updateUser(userId, updateParams) 
  .catch((error) => { 
    if (error.code === 'auth/user-not-found') { 
      updateParams['uid'] = userId; 
      if (email) { 
        updateParams['email'] = email; 
      } 
      return firebaseAdmin.auth().createUser(updateParams); 
    } 
    throw error; 
  });
};

/** 
 * createFirebaseToken - returns Firebase token using Firebase Admin SDK 
 * 
 * @param {String} kakaoAccessToken access token from Kakao Login API 
 * @return {Promise<String>} Firebase token in a promise 
 */
function createFirebaseToken(kakaoAccessToken) { 
  return requestMe(kakaoAccessToken).then((response) => { 
    const body = JSON.parse(response); 
    const userId = `kakao:${body.id}`; 
    if (!userId) { 
      return res.status(404) 
      .send({message: 'There was no user with the given access token.'}); 
    }
    console.log(userId)
    console.log(response)
    return updateOrCreateUser(userId, body.kaccount_email, 
      body.properties.nickname, body.properties.profile_image); 
  }).then((userRecord) => { 
    const userId = userRecord.uid; 
    console.log(`creating a custom firebase token based on uid ${userId}`); 
    return firebaseAdmin.auth().createCustomToken(userId, {provider: 'KAKAO'}); 
  });
};

// create an express app and use json body parser
const app = express();
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));

// default root url to test if the server is up
app.get('/', (req, res) => res.status(200)
.send('KakaoLoginServer for Firebase is up and running!')); 

// actual endpoint that creates a firebase token with Kakao access token
app.post('/verifyToken', (req, res) => { 
  console.log("한번")
  const token = req.body.token; 
  if (!token) return res.status(400) 
   .send({message: 'Access token is a required parameter.'}); 
  createFirebaseToken(token).then((firebaseToken) => { 
    console.log(`Returning firebase token to user: ${firebaseToken}`); 
    res.send({firebase_token: firebaseToken}); 
  });
});


// Start the server
const server = app.listen(process.env.PORT || '8000', () => { 
  console.log('KakaoLoginServer for Firebase listening on port %s', 
  server.address().port);
});


var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/test');

var RegisterLocation = require('./models/registerlocation')

var Locations = require('./models/location');
var locationroute = require('./routes/location_main')(app, Locations);

var Device = require('./models/device');
var deviceroute = require('./routes/device_main')(app, Device, RegisterLocation, Locations);

var Bunsilmul = require('./models/bunsilmul');
var bunsilmulroute = require('./routes/bunsilmul_main')(app, Bunsilmul, Device, RegisterLocation, firebaseAdmin);