// // Adding these configs here as this is for POC and no env is setup up previously
// export const firebaseConfig = {
//   apiKey: "AIzaSyBmGney9wG2-cRgMIkg9865U_6AeQJOApg",
//   authDomain: "textextractorauth.firebaseapp.com",
//   projectId: "textextractorauth",
//   storageBucket: "textextractorauth.appspot.com",
//   messagingSenderId: "234037606323",
//   appId: "1:234037606323:web:a005c01b4ba016ba37bdc6",
//   measurementId: "G-BQLNBTWZ2T",
// };


import dotenv from 'dotenv';

//Load environment variables from .env file
dotenv.config();

export const firebaseConfig = {

  apiKey: process.env.API_KEY,

  authDomain: AUTH_DOMAIN,

  projectId: PROJECT_ID,

  storageBucket: STORAGE_BUCKET,

  messagingSenderId: MESSAGING_SENDER_ID,

  appId: APP_ID,

  measurementId: MEASUREMENT_ID,

};

