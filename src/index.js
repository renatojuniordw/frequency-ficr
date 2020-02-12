import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { Redirect, Route, Router } from "react-router";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import createBrowserHistory from "history/createBrowserHistory";

import home from './components/Home/home'
import login from './components/login-google/loginGoogle'
import CheckFrequency from './components/check-frequency/check-frequency';
import History from './components/history-frequency/history';
import { pedirPermissaoParaReceberNotificacoes } from '../src/push-notification';

ReactDOM.render(<App />, document.getElementById('root'));
pedirPermissaoParaReceberNotificacoes();

const muiTheme = getMuiTheme({
    appBar: {
        color: "#37517E",
        height: 50
    },
});


const customHistory = createBrowserHistory();
const Root = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Router history={customHistory}>
            <div>
                <Route path="/login" component={login} />
                <Route path="/app/home" component={home} />
                <Route path="/app/perfil" component={CheckFrequency} />
                <Route path="/app/history" component={History} />
                <Redirect from="/" to="/login" />
            </div>
        </Router>
    </MuiThemeProvider>
);
ReactDOM.render(<Root />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
