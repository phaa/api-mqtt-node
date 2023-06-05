import * as mqtt from "mqtt";

class MqttClient {

  constructor(topics) {
    this.subscribeTopics = topics;
    this.client = mqtt.connect('mqtt://test.mosquitto.org');
  }

  initialize() {
    this.connect();
    this.subscribe();
    this.configureMqttLoop();
  }

  connect() {
    this.on('connect', function () {
      console.log("Conectado com sucesso ao broker");
    });
  }

  subscribe() {
    for (const key in subscribeTopics) {
      let topic = subscribeTopics[key];

      this.client.subscribe(topic, function () {
        console.log(`Inscrito no tópico: ${topic}`)
      });
    }
  }

  configureMqttLoop() {
    this.clientclient.on('message', function (topic, payload) {
      const message = payload.toString();
      //console.log(`Chegou mensagem ${message} no tópico ${topic}`);

      if (topic == subscribeTopics.sensor1) {
        sensor1 = Number(message);
        console.log(`Setou sensor1 = ${sensor1}`);
      }
      else if (topic == subscribeTopics.sensor2) {
        sensor2 = Number(message);
        console.log(`Setou sensor2 = ${sensor2}`);
      }
    });
  }
}

export default MqttClient;



