var mqtt = require('mqtt')
var client  = mqtt.connect({host: 'sMirrorMaster'})


client.on('connect', function () {
  client.publish('ledStatus', '0');
  setTimeout(function() {
    client.publish('ledStatus', '1');
  }, 1000)
  console.log("Done Blinking");
})
