/*
 * hue.js
 */

// Private
var hue = require("node-hue-api");
var HueApi = hue.HueApi;
var lightState = hue.lightState;
var state = lightState.create();
var partyCounter = 0;
var host =  "10.0.1.205";
var username ="newdeveloper";
var api = new HueApi(host, username);
var lightSwitch = false;

function displayStatusf(status){
    console.log(JSON.stringify(status.state.hue, null, 2));
};

function displayResult(result){
    console.log(result);
}

function displayError(err){
    console.error(err);
}


// Public
var self = module.exports = {

  someProperty: 'I am public variable most def',

  // TURN ON THE BULB
  //
  turnOn: function()
  {
      //api.setLightState(1,state.on()).then(displayResult).fail(displayError).done();
      //api.setLightState(2,state.on()).then(displayResult).fail(displayError).done();
      //api.setLightState(3,state.on()).then(displayResult).fail(displayError).done();
      api.setLightState(1, {"on": true}, function(err, result) {
          if (err) throw err;
          displayResult(result);
      });
      api.setLightState(2, {"on": true}, function(err, result) {
          if (err) throw err;
          displayResult(result);
      });
      api.setLightState(3, {"on": true}, function(err, result) {
          if (err) throw err;
          displayResult(result);
      });
  },

  turnOff: function(){
    api.setLightState(1, {"on": false}, function(err, result) {
        if (err) throw err;
        displayResult(result);
    });
    api.setLightState(2, {"on": false}, function(err, result) {
        if (err) throw err;
        displayResult(result);
    });
    api.setLightState(3, {"on": false}, function(err, result) {
        if (err) throw err;
        displayResult(result);
    });
  },

  partyOn: function(){
    console.log('  -- starting party mode!');
    api.setLightState(1, lightState.create().on().effect('colorloop')).then(displayResult).fail(displayError).done();
    api.setLightState(2, lightState.create().on().effect('colorloop')).then(displayResult).fail(displayError).done();
    api.setLightState(3, lightState.create().on().effect('colorloop')).then(displayResult).fail(displayError).done();
  },

  partyOff: function(){
    console.log('  -- stoping party mode!');
    api.setLightState(1, lightState.create().on().effect('none')).then(displayResult).fail(displayError).done();
    api.setLightState(2, lightState.create().on().effect('none')).then(displayResult).fail(displayError).done();
    api.setLightState(3, lightState.create().on().effect('none')).then(displayResult).fail(displayError).done();
  },

  setHSL: function(data){
    console.log('set hue:  ' + data.hue)
    console.log('set sat:  ' + data.sat)
    console.log('set bri:  ' + data.bri)
    api.setLightState(1, lightState.create().hsl(data.hue, data.sat, data.bri)).then(displayResult).fail(displayError).done();
    api.setLightState(2, lightState.create().hsl(data.hue, data.sat, data.bri)).then(displayResult).fail(displayError).done();
    api.setLightState(3, lightState.create().hsl(data.hue, data.sat, data.bri)).then(displayResult).fail(displayError).done();
  }
};
