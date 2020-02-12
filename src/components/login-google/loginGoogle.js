import React, { useState } from 'react';
import { FontIcon, RaisedButton } from "material-ui";
import { loginWithGoogle } from "../../helpers/auth";
import { firebaseAuth } from "../../config/constants-firebase";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import Image from 'react-bootstrap/Image'
import logoFICR from '../../img/Logotipo-Frequency-2.png'

import "./style-login.css"
import Header from "../header/header";

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";
var mostrar = false;

export default class Login extends React.Component {
    // let mostrar = false;    
    constructor(props) {
        super(props);
        this.state = {
            splashScreen: false
        };

        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    handleGoogleLogin() {
        loginWithGoogle()
            .catch(function (error) {
                console.log(error); // or show toast
                localStorage.removeItem(firebaseAuthKey);
            });
        localStorage.setItem(firebaseAuthKey, "1");
    }

    showModal(status) {
        mostrar = status;
        console.log('mostrar');
    }

    componentWillMount() {

        if (localStorage.getItem(appTokenKey)) {
            this.props.history.push("/app/home");
            return;
        }

        firebaseAuth().onAuthStateChanged(user => {
            if (user) {
                localStorage.removeItem(firebaseAuthKey);

                localStorage.setItem(appTokenKey, user.uid);
                localStorage.setItem("email", user.email);
                localStorage.setItem("displayName", user.displayName);
                localStorage.setItem("photoURL", user.photoURL);
                localStorage.setItem("id", user.uid);

                // store the token
                this.props.history.push("/app/home")
            }
        });
    }

    render() {
        console.log(firebaseAuthKey + "=" + localStorage.getItem(firebaseAuthKey));
        if (localStorage.getItem(firebaseAuthKey) === "1") return <SplashScreen />;
        return <LoginPage handleGoogleLogin={this.handleGoogleLogin} modal={this.showModal} nada={this.mostrar} />;
    }


}

const LoginPage = ({ handleGoogleLogin, modal, nada }) => (
    <div className="body">
        <div className="div-conteudo-login">
            <Image className="image-logo-login" src={logoFICR} />
            <div className="row div-btn-login">
                <button onClick={handleGoogleLogin} type="button" className="btn btn-primary btn-block"> <i className="fa fa-google"></i> Login Google</button>
            </div>
        </div>
    </div>
);
const SplashScreen = () => (
    <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
    </div>
)




