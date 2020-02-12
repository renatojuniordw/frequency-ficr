import "react-dates/initialize"
import React from 'react';
import { Card } from 'react-bootstrap'
import moment from 'moment'
import "react-dates/lib/css/_datepicker.css";

import "moment/min/locales";
import Swal from 'sweetalert2'

import './style.css';

import UTILS from '../history-frequency/UTILS.js'

moment.locale('pt');

const $ = require('jquery');

export default class History extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        getExtrato();
    }

    viewData() {
        $(".div-extrato .card-extrato").remove()
        const dtInicio = $("#input-dt-inicio").val(), dtFim = $("#input-dt-fim").val();

        if (dtInicio !== "" && dtFim !== "") {
            var matriculaAluno = localStorage.getItem("matricula");
            $(".div-extrato .card-extrato").remove()
            UTILS.getExtrato(`?matricula=${matriculaAluno}&dtInicio=${dtInicio}&dtFim=${dtFim}`);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                type: 'info',
                text: 'Favor preencher todos os campos.'
            }).then((result) => {
                if (result.value) {
                    $(".div-extrato .card-extrato").remove()
                    var matriculaAluno = localStorage.getItem("matricula");
                    UTILS.getExtrato(`?matricula=${matriculaAluno}&dtInicio=0&dtFim=0`);
                }
            });
        }

    }

    render() {
        return (
            <div className="div-conteudo-history">

                <div className="card-total-presenca">
                    <h5>Total de presença <span className="badge badge-secondary" id="span-qtd-presenca">0</span></h5>
                </div>
                <br></br>

                <Card>
                    <Card.Body id="card-calendario">
                        <div className="row">
                            <div className="col-12">
                                <h6>Período:</h6>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12 mb-2">
                                <input type="date" className="form-control" id="input-dt-inicio"></input>
                            </div>
                            <div className="col-md-6 col-xs-12 ">
                                <input type="date" className="form-control" id="input-dt-fim"></input>
                            </div>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col-12">
                                <button type="button" onClick={this.viewData} className="btn btn-primary btn-block">FILTRAR</button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
                <br></br>

                <div className="div-extrato"></div>

                <br></br>
            </div>
        );
    }
}


function getExtrato() {
    $(".div-extrato .card-extrato").remove()

    var matriculaAluno = localStorage.getItem("matricula");
    UTILS.getExtrato(`?matricula=${matriculaAluno}&dtInicio=0&dtFim=0`);
}