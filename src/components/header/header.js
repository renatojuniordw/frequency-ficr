import React from 'react';

import Image from 'react-bootstrap/Image'
import svgSeta from '../../img/left-arrow.svg'

import "./header.css"

var propAux = "";

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        propAux = this.props
        this.state = {
            splashScreen: false
        };
    }

    returnHome() {
        console.log("props", propAux.history);
    }

    regraSetaLeft() {
        var _propAux = propAux;
        if (window.location.pathname !== "/app/home" && window.location.pathname !== "/login") {
            return <Image className="svg-left-arrow" src={svgSeta} onClick={this.returnHome} />
        }
    }
    render(props) {
        return (
            <header className="header" id="main-header">
                FREQUENCY
            </header>
        );
    }
}