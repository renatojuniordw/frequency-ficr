importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: "637588347230" // troque pelo seu sender id 
});

const messaging = firebase.messaging();



//COLOCAR NA PASTA BUILD