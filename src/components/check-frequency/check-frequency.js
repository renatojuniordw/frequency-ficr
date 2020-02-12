import React from 'react';
import { Card } from 'react-bootstrap'
import moment from 'moment'
import AddToHomescreen from 'react-add-to-homescreen';

import "./check.css"

import Image from 'react-bootstrap/Image'
import logoFICR from '../../img/logo-ficr-oficial.png'

import Swal from 'sweetalert2'

import urlServer from '../../config/const-server.js'
import { pedirPermissaoParaReceberNotificacoes } from '../../push-notification';

const axios = require('axios');

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      splashScreen: false
    };
  }

  handleAddToHomescreenClick = () => {
    alert(`
      1. Open Share menu
      2. Tap on "Add to Home Screen" button`);
  };

  componentWillMount() {
    getAlunoLogado();
  }

  regraRegistrarChamada() {

    const emailUsuario = localStorage.getItem("email").split("@")[0];

    return axios.get(urlServer.urlRegistro + emailUsuario).then(function (response) {
      if (response.data.length > 0) {
        const itemAluno = response.data[0];
        condicaoRegistrarChamada(itemAluno.data_hora);
      } else {
        validacaoRegistroChamada();
      }
    }).catch(function (error) {
      console.log('Error: ', error);
    });

  }

  render() {
    return (
      <div className="div-conteudo">
        <Image className="image-logo" src={logoFICR} />
        <div>
          <Card className="card-usuario">
            <Card.Body>
              <Image className="image-user" src={getImageUser()} />
              <Card.Title className="saudaocao-usuario">Olá, <span>{localStorage.getItem("displayName")}</span>  </Card.Title>
              <Card.Text>
                {localStorage.getItem("email")}
              </Card.Text>
              <div className="">
                <button onClick={this.regraRegistrarChamada} type="button" className="btn btn-primary btn-block buttons-sistema">Registrar Frequência</button>
                {/* <button onClick={pedirPermissaoParaReceberNotificacoes} type="button" className="btn btn-primary btn-block buttons-sistema">Teste notification</button> */}
              </div>
            </Card.Body>
          </Card>
        </div>
        <AddToHomescreen onAddToHomescreenClick={this.handleAddToHomescreenClick} />
      </div >
    );
  }

}

function validacaoRegistroChamada() {

  navigator.geolocation.getCurrentPosition(location => {
    const result = location.coords,
      query = `origins=-8.040965%2C%20-34.939938&destinations=${result.latitude}%20${result.longitude}&mode=driving&units=metric&language=en&avoid=&key=AIzaSyAnwQkPbCWpfrDLESG43aSUKgeqsvzRl0Q`;

    fetch(urlServer.urlProxy + urlServer.urlApiMpas + query)
      .then(response => response.text())
      .then(contents => {
        var distance = JSON.parse(contents).rows[0].elements[0].distance.value;

        console.log(distance);

        if (distance <= 1800) {
          validacaoDiaHora()
        } else {
          Swal.fire(
            `Olá ${localStorage.getItem("displayName")}, notamos que você não está na instituição.`,
            `O registro da frequência só pode ser efetuada caso esteja na instituição.`,
            'error'
          )
        }
      })
      .catch(() => console.log("Can’t access " + urlServer.urlApiMpa + " response. Blocked by browser?"))

  }, (erro) => {
    console.log(erro)
    if (erro.code == 1) {
      Swal.fire(
        `Olá ${localStorage.getItem("displayName")}.`,
        `Para registrar a frêquncia é necessário autorizar acesso a sua localização.`,
        'error'
      );

      navigator.geolocation.getCurrentPosition(location => { });
    }
  })

}

function validacaoDiaHora() {
  const matricula = localStorage.getItem("matricula");
  return axios.get(urlServer.urlDiaHora + matricula).then((response) => {
    if (response.data.length > 0) {
      validaDiaHoraAction(response.data[0]);
    }
  });
}

function validaDiaHoraAction(data) {
  let dataHoraAtual = new Date();
  let dias = JSON.parse(data.dias);
  let horaAtual = dataHoraAtual.getHours() + ":" + dataHoraAtual.getMinutes() + ":00";

  let permissaoDia = false;
  let permissaoHora = false;

  dias.forEach(dia => {
    if (dia === dataHoraAtual.getDay()) {
      permissaoDia = true;
      if (horaAtual >= data.hora_inicio && horaAtual <= data.hora_final) {
        permissaoHora = true;
      }
    }
  });

  if (!permissaoDia) {
    Swal.fire(
      `Olá ${localStorage.getItem("displayName")}.`,
      `Identificamos que você não tem aula no dia de hoje, por este motivo não pode registrar sua frequência.`,
      'error'
    );
  } else if (!permissaoHora) {
    Swal.fire(
      `Olá ${localStorage.getItem("displayName")}.`,
      `Identificamos que você não está dentro do horário da sua turma, por este motivo não pode registrar sua frequência.`,
      'error'
    );
  } else {
    registrarChamada();
  }
}

function clearDadosStorage() {
  window.indexedDB.databases().then((r) => {
    for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
  }).then(() => {
    localStorage.clear();
    window.location.href = "/login"
  });
}

function getRegistroUsuarioLogado() {
  const emailUsuario = localStorage.getItem("email").split("@")[0];

  return axios.get(urlServer.urlRegistro + emailUsuario).then(function (response) {
    if (response.data.length > 0) {
      localStorage.setItem("dataHoraUltimaChamada", response.data[0].data_hora);
    } else {
      localStorage.setItem("dataHoraUltimaChamada", 0);
    }
  }).catch(function (error) {
    console.log('Error: ', error);
  });
}

function getAlunoLogado() {
  const emailUsuario = localStorage.getItem("email").split("@")[0];
  return axios.get(urlServer.urlAluno + emailUsuario).then(function (response) {
    if (response.data.length > 0) {
      const itemAluno = response.data[0];
      localStorage.setItem("matricula", itemAluno.matricula);
      getRegistroUsuarioLogado();
    } else {
      _alertMsgUsuarioNaoEncontrado()
    }
  }).catch(function (error) {
    console.log('Error: ', error);
  });
}


function _alertMsgUsuarioNaoEncontrado() {

  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: `Olá '${localStorage.getItem("displayName")}' notamos que você está se conectando com um endereço de e-mail '${localStorage.getItem("email")}', e este e-mail não é válido, favor se conectar com o e-mail do dominio '@a.ficr.edu.br'.`
  }).then((result) => {
    if (result.value) {
      console.error("Aluno não encontrado.")
      clearDadosStorage();
    }
  });
}

function registrarChamada() {
  var emailUsuario = localStorage.getItem("email").split("@")[0];
  return axios.post(urlServer.urlFrequenta, {
    email: emailUsuario,
  }).then(function (response) {
    localStorage.setItem("dataChamada", new Date().toLocaleDateString());
    localStorage.setItem("dataHoraUltimaChamada", new Date().toLocaleString());

    Swal.fire(
      '"Frequência registrada com sucesso"',
      '',
      'success'
    )

  }).catch(function (error) {
    console.log(error);
  });
}

function condicaoRegistrarChamada(data) {
  const _dtUltimaChamada = moment(data).format('YYYY-MM-DD'),
    _dataAtual = moment().format('YYYY-MM-DD');

  if (!moment(_dtUltimaChamada).isSame(moment(_dataAtual))) {
    validacaoRegistroChamada()
  } else {
    Swal.fire(
      'Frequência já realizada!',
      `Último registo ${moment(data).format('DD/MM/YYYY HH:MM')}`,
      'warning'
    )
  }
}

function getImageUser() {
  return localStorage.getItem("photoURL")
}
