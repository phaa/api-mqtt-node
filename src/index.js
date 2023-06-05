// Importações servidor
import express from 'express';
import bodyParser from 'body-parser';

import MqttClient from './MqttClient';

const subscribeTopics = {
  sensor1: 'ifrn/teste/sensor1',
  sensor2: 'ifrn/teste/sensor2',
};

const mqttClient = new MqttClient(subscribeTopics);
mqttClient.initialize();

// Configurações do MQTT
let sensor1 = 0;
let sensor2 = 0;

// Configurações do servidor
const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }))

// Rotas
server.get("/get-sensor1", function(requisition, response) {
  const context = {
    value: sensor1
  }
  return response.status(200).json(context);
});

server.get("/get-sensor2", function(requisition, response) {
  const context = {
    value: sensor2
  }
  return response.status(200).json(context);
});

server.post("/send-mqtt", function(requisition, response) {
  const comando = requisition.body.comando;
  
  //client.publish('ifrn/teste/comando', comando);
  console.log(`Comando recebido foi ${comando}`);

  response.status(200).send("Mensagem enviada com sucesso!");
});

// Iniciar Servidor
const port = 3000;
server.listen(port, function () {
  console.log(`Servidor rodando na porta ${port}`);
});
