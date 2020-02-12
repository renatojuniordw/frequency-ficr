import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB3Jel3JEP8km_Paq7CLU99e3XGzSYl71E",
    authDomain: "frequencyficr.firebaseapp.com",
    databaseURL: "https://frequencyficr.firebaseio.com",
    projectId: "frequencyficr",
    storageBucket: "frequencyficr.appspot.com",
    messagingSenderId: "637588347230",
    appId: "1:637588347230:web:991608e17767ddb51857cf"
};

firebase.initializeApp(config);

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;