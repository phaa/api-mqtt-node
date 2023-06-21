import * as mqtt from "mqtt";

class MqttClient {

  constructor() {
    //mqtt://test.mosquitto.org
    this.client = mqtt.connect('mqtt://10.44.1.35');
    this.sensor1 = 0;
    this.sensor2 = 0;

    // adicione seus tópicos aqui
    this.subscribeTopics = [
      'esp32/humidity03',
      'esp32/temperature03'
    ]
  }

  initialize() {
    this.connect();
    this.configureMqttLoop();
  }

  connect() {
    this.client.on('connect', () => {
      console.log("Conectado com sucesso ao broker");
    });
  }

  subscribe() {
    for (const topic of this.subscribeTopics) {
      this.client.subscribe(topic, () => {
        console.log(`Inscrito no tópico: ${topic}`)
      });
    }
  }

  configureMqttLoop() {
    this.client.on('message', (topic, payload) => {
      const message = payload.toString();
      // descomente se quiser ver todas as mensagens 
      //console.log(`Chegou mensagem ${message} no tópico ${topic}`);

      // crie um caso para entrada de dados em cada tópico
      switch (topic) {
        case 'esp32/humidity03': {
          this.sensor1 = Number(message);
          console.log(`Umidade = ${this.sensor1}`);
          break;
        }
        case 'esp32/temperature03': {
          this.sensor2 = Number(message);
          console.log(`Temperatura = ${this.sensor2}`);
          break;
        }
      }
    });
  }
}

export default MqttClient;





