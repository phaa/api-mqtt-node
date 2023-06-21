// Importações servidor
import express from 'express'; //npm i express --save
import bodyParser from 'body-parser';
import MqttClient from './MqttClient.js';

export default class Server {
  constructor(port) {
    this.port = port;
    this.server = express();
    this.mqttClient = new MqttClient();
  }

  initialize() {
    // É necessário configurar o MQTT antes do servidor express
    this.mqttClient.initialize();
    this.mqttClient.subscribe();

    this.configureServer();
    this.configureRoutes();

    // Coloca o express para rodar na porta escolhida
    this.server.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }

  configureServer() {
    // Configura o express para entender JSON
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));

    // Adicionar regras de acesso para o Ionic poder acessar a API
    this.server.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
  }

  configureRoutes() {
    this.server.get("/", (requisition, response) => {
      const context = {
        sensors: [
          this.mqttClient.sensor1,
          this.mqttClient.sensor2,
        ]
      }
      return response.status(200).json(context);
    });

    this.server.get("/get-sensor1", (requisition, response) => {
      const context = {
        value: this.mqttClient.sensor1,
      }

      return response.status(200).json(context);
    });

    this.server.get("/get-sensor2", (requisition, response) => {
      const context = {
        value: this.mqttClient.sensor2
      }
      return response.status(200).json(context);
    });

    // enviar dados do ionic para o servidor
    this.server.post("/send-mqtt", (requisition, response) => {
      const comando = requisition.body.comando;

      //this.mqttClient.publish('ifrn/teste/comando', comando);
      console.log(`Comando recebido foi ${comando}`);

      response.status(200).send("Mensagem enviada com sucesso!");
    });
  }
}

