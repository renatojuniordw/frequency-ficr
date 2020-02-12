import moment from 'moment'
import "moment/min/locales";

import svgCalendarioCkeck from '../../img/calendario-check.svg'
import urlServer from '../../config/const-server.js'

moment.locale('pt');

const axios = require('axios');
const $ = require('jquery');

const UTILS = {} || UTILS;

UTILS.getExtrato = (query) => {
    $(".div-extrato .card-extrato").remove()
    moment.locale('pt');

    axios.get(urlServer.urlExtrato + query).then(function (response) {
        if (response.data.length > 0) {
            $("#span-qtd-presenca").html(response.data.length);
            $.each(response.data, function (i, itemAluno) {
                $(".div-extrato").append(htmlExtrato(itemAluno.data_hora));
            });
        } else {
            $("#span-qtd-presenca").html(response.data.length);
        }
    }).catch(function (error) {
        console.log('Error: ', error);
    });
}

function htmlExtrato(dataHora) {
    return `
            <div class="card-extrato">
                <img src="${svgCalendarioCkeck}" alt="Logo calendário confirmação" class="svg-calendario-check">
                <label class="card-Body-calendario">
                    ${moment(dataHora).format("dddd, D MMMM YYYY")}
                </label>
            </div >
        `
}


export default UTILS;