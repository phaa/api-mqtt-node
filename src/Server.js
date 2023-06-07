// Importações servidor
import express from 'express';
import bodyParser from 'body-parser';
import MqttClient from './MqttClient.js';

export default class Server {
  constructor(port) {
    this.port = port;
    this.server = express();
    this.mqttClient = new MqttClient();
  }

  initialize() {  
    // Deixa o mqtt configurado antes do servidor iniciar
    this.mqttClient.initialize();
    this.mqttClient.subscribe({
      sensor1: 'ifrn/teste/sensor1',
      sensor2: 'ifrn/teste/sensor2',
    });

    // Enfim configura o servidor
    this.configureServer();
    this.configureRoutes();

    this.server.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
    });
  }

  configureServer() {
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
  }

  configureRoutes() {
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

    this.server.post("/send-mqtt", (requisition, response) => {
      const comando = requisition.body.comando;

      //client.publish('ifrn/teste/comando', comando);
      console.log(`Comando recebido foi ${comando}`);

      response.status(200).send("Mensagem enviada com sucesso!");
    });
  }
}

