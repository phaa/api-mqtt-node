import * as mqtt from "mqtt";

export default class MqttClient {

  constructor() {
    //mqtt://test.mosquitto.org
    this.client = mqtt.connect('mqtt://10.44.1.35');
    this.sensor1 = 0;
    this.sensor2 = 0;
  }

  initialize() {
    this.connect();
    this.subscribe();
    this.configureMqttLoop();
  }

  connect() {
    this.client.on('connect', () => {
      console.log("Conectado com sucesso ao broker");
    });
  }

  subscribe(topics) {
    this.subscribeTopics = topics;
    // Itera sobre os tópicos e se inscreve em cada um 
    for (const key in topics) {
      let topic = topics[key];

      this.client.subscribe(topic, () => {
        console.log(`Inscrito no tópico: ${topic}`)
      });
    }
  }

  configureMqttLoop() {
    this.client.on('message', (topic, payload) => {
      const message = payload.toString();
      //console.log(`Chegou mensagem ${message} no tópico ${topic}`);
      
      if (topic == this.subscribeTopics.sensor1) {
        this.sensor1 = Number(message);
        console.log(`Setou sensor1 = ${this.sensor1}`);
      }
      else if (topic == this.subscribeTopics.sensor2) {
        this.sensor2 = Number(message);
        console.log(`Setou sensor2 = ${this.sensor2}`);
      }
    });
  }

  publish(topic, payload){
    client.publish(topic, payload);
  }
}

