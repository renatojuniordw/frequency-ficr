import firebase from 'firebase';

export const inicializarFirebase = () => {
    firebase.initializeApp({
        messagingSenderId: "637588347230"
    });
}

export const pedirPermissaoParaReceberNotificacoes = async () => {
    try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('token do usuário:', token);
        enviarNotificacao(token)
        return token;
    } catch (error) {
        console.error(error);
    }
}


function enviarNotificacao(tokenUsuario) {
    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAAlHM6GV4:APA91bFjogTURteJwsOG7fLGiqG0IhagSjFtX3crElNCBdXyykvWVp0bnY-ba9pzRYj4JwsTf8tkQBBgI4rw_6jN3gd613ZF03soMCXwTL0MBCSzfckyU7_mlffzgJbZEHKjCHg20Jib'
        },
        body: JSON.stringify(
            {
                "notification": {
                    "title": "Frequência",
                    "body": `Olá ${localStorage.getItem("displayName")}, não se esqueça de registrar sua frequência.`,
                    "click_action": "https://frequencyficr.firebaseapp.com/",
                    "icon": "images/icons/icon-144x144.png"
                },
                "to": tokenUsuario
            }
        )
    });
}