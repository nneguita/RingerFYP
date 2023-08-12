//importing firebase to be used as the server, and its components.
import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

//this code was pasted from the firebase because it has been provided.
var firebaseConfig = {
    apiKey: "AIzaSyBv23FDnbw5CZc1AS8fZSd9w1Porboyc7s",
    authDomain: "ringer-chatting.firebaseapp.com",
    //this is the url that's connecting this app with firebase
    databaseURL: "https://ringer-chatting.firebaseio.com",
    projectId: "ringer-chatting",
    storageBucket: "ringer-chatting.appspot.com",
    messagingSenderId: "144931645071",
    appId: "1:144931645071:web:e21b4764e8e0e931"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;