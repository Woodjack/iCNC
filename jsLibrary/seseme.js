var five = require('johnny-five');
var board = new five.Board();
var stepper = {};
var MAXHEIGHT = 5000; // macro for max height of pillar
var OPEN = 1; // macro for relay

pinData ={
  m1: {},
  m2: {},
  m3: {},
  m4: {},
}
pinData.m1.dir = 2
pinData.m1.step = 3
pinData.m1.enable = 4

pinData.m2.dir = 5
pinData.m2.step = 6
pinData.m2.enable = 7

pinData.m3.dir = 8
pinData.m3.step = 9
pinData.m3.enable = 10

pinData.m4.dir = 11
pinData.m4.step = 12
pinData.m4.enable = 13

board.on("ready", function() {
  stepper.m1 = {position:0, isRunning:false};
  stepper.m1.motor = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: pinData.m1.step,
      dir: pinData.m1.dir
    }
  });
  stepper.m2 = {position:0, isRunning:false};
  stepper.m2.motor = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: pinData.m2.step,
      dir: pinData.m2.dir
    }
  });
  stepper.m3 = {position:0, isRunning:false};
  stepper.m3.motor = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: pinData.m3.step,
      dir: pinData.m3.dir
    }
  });
  stepper.m4 = {position:0, isRunning:false};
  stepper.m4.motor = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: {
      step: pinData.m4.step,
      dir: pinData.m4.dir
    }
  });
  stepper.m1.enableMotor = new five.Relay(pinData.m1.enable);
  stepper.m2.enableMotor = new five.Relay(pinData.m2.enable);
  stepper.m3.enableMotor = new five.Relay(pinData.m3.enable);
  stepper.m4.enableMotor = new five.Relay(pinData.m4.enable);
  console.log('**--------BOARD IS READY!!!')
});
//    Module export
var self = module.exports = {
      rpm: 215,
      accel:1700,
      isRunning: false,
      maxPosition: 5000,// motor runing at full stepping (1200*4),
      buffer: 60,
      creepCounter: 0,
      creepRate: 200,

      isRunning: function(){
          if(!stepper.m1.isRunning && !stepper.m2.isRunning && !stepper.m3.isRunning && !stepper.m4.isRunning){
              return false;
          }
          else
              return true;
      },

      getStats: function(){
        return {m1: stepper.m1.position,
          m2: stepper.m2.position,
          m3: stepper.m3.position,
          m4: stepper.m4.position}
      },

      reset: function(motorName){
        stepper[motorName].position=0;
      },

      testCycle: function(state){
        var that = this;
        var adjust = 1;
        if(!state) adjust = -1;
        this.moveMotorCallback('m1', (1000*adjust), 1, function(){
          console.log('at the top!');
          if(!state) that.testCycle(0);
        })
      },

      positionToPercent: function(motorName){
        return stepper[motorName].position/this.maxPosition;
      },

      percentToPosition: function(percent){
        return (percent*this.maxPosition)
      },

      moveToPercent: function(motorName, newPercent){
        var newPosition = percentToPosition(newPercent);
        console.log('percent = ' + newPercent)
        console.log('position = ' + newPosition)
        this.moveToPosition(newPosition);
        },

      moveToPosition: function(motorName, newPosition){
        newPosition = (newPosition/100)*this.maxPosition;
        if(newPosition > stepper[motorName].position){
          newPosition = (Math.abs(newPosition - stepper[motorName].position));
          console.log('$$$motor:' +motorName + '  $$$$steps:' + newPosition + '   $$$DIR:1')
          this.moveMotor(motorName, newPosition, 1)
        }
        else{
          newPosition = (Math.abs(newPosition - stepper[motorName].position));
          console.log('$$$motor:' +motorName + '  $$$$steps:' + newPosition +  '   $$$DIR:0')
          this.moveMotor(motorName, Math.abs(newPosition), 0)
        }
      },

      moveToPositionCallback: function(motorName, newPosition, callback){
        newPosition = (newPosition/100)*this.maxPosition;
        if(newPosition > stepper[motorName].position){
          newPosition = (Math.abs(newPosition - stepper[motorName].position));
          console.log('$$$motor:' +motorName + '  $$$$steps:' + newPosition + '   $$$DIR:1')
          this.moveMotor(motorName, newPosition, 1)
        }
        else{
          console.log(' -- DOWN');
          newPosition = (Math.abs(newPosition - stepper[motorName].position));
          console.log('$$$motor:' +motorName + '  $$$$steps:' + newPosition +  '   $$$DIR:0')
          this.moveMotor(motorName, Math.abs(newPosition), 0)
        }
          callback();
        },

      moveMotorCreep: function(motorName, steps, dir){
        var that = this;
        console.log('hi')
        console.log('moving creep steps ========= ' + that.creepRate)
        if(this.creepCounter < steps/this.creepRate){
          this.creepCounter += 1;
          console.log('yoyo')
          this.moveMotorCallback(motorName, this.creepRate, dir, function(){
            console.log('yoyo **********************')
            that.moveMotorCreep(motorName, steps, dir)
          });
        }
        else{
          this.moveMotor(motorName, (steps-(this.creepCounter*this.creepRate)))
        }
      },

      moveMotor: function(motorName, steps, dir){
        console.log('motorName -- ' + motorName )
        if(!stepper[motorName].isRunning){
          var that = this;
          stepper[motorName].enableMotor.on();
          if(dir == 0){
            if(stepper[motorName].position - steps < this.buffer){
              steps = stepper[motorName].position - this.buffer
              console.log('adjusted steps')
            }
            if(stepper[motorName].position > this.buffer){
              stepper[motorName].isRunning = true;
              console.log('       --- MOVING ** ' + motorName)
              var beforeTime = Date.now();
              stepper[motorName].motor.rpm(this.rpm).ccw().accel(this.accel).decel(this.accel).step(steps, function(){
                console.log("Time to move: " + (Date.now() - beforeTime) / 1000 + " seconds\nSteps: " + steps);
                console.log(' -- done moving ---  Motor: '+ motorName +'  steps:' + steps + '  dir: ' + dir )
                stepper[motorName].isRunning = false;
                stepper[motorName].position -= steps
                console.log('  position: ' + stepper[motorName].position)
              });
            }
          }
          else if(dir == 1){
            if(stepper[motorName].position+steps > this.maxPosition - this.buffer){
              steps = (this.maxPosition - this.buffer) - stepper[motorName].position
              console.log('adjusted steps')
            }
            if(stepper[motorName].position < this.maxPosition){
              stepper[motorName].isRunning = true;
              console.log('MOVING ** ' + motorName)
              var beforeTime = Date.now();
              stepper[motorName].motor.rpm(this.rpm).cw().accel(this.accel).decel(this.accel).step(steps, function(){
                console.log("Time to move: " + (Date.now() - beforeTime) / 1000 + " seconds\nSteps: " + steps);
                console.log('DONE Moving!!!!!-  Motor: '+ motorName +'  steps:' + steps + '  dir: ' + dir )
                stepper[motorName].isRunning = false;
                stepper[motorName].position += steps;
                stepper[motorName].enableMotor.off();
                console.log('position: ' + stepper[motorName].position)
              });
            }
          }
        }
        else console.log('already running')
      },

      moveMotorCallback: function(motorName, steps, dir, data, callback){
        if(!stepper[motorName].isRunning){
          var that = this;
          if(dir == 0){
            if(stepper[motorName].position - steps < this.buffer){
              steps = stepper[motorName].position - this.buffer
              console.log('adjusted steps')
            }
            if(stepper[motorName].position > this.buffer){
              stepper[motorName].isRunning = true;
              console.log('MOVING ** ' + motorName)
              stepper[motorName].motor.rpm(this.rpm).ccw().accel(this.accel).decel(this.accel).step(steps, function(){
                console.log('DONE Moving!!!!!-  Motor: '+ motorName +'  steps:' + steps + '  dir: ' + dir )
                stepper[motorName].isRunning = false;
                stepper[motorName].position -= steps
                console.log('position: ' + stepper[motorName].position)
                callback(data);
              });
            }
          }
          else if(dir == 1){
            if(stepper[motorName].position+steps > this.maxPosition - this.buffer){
              steps = (this.maxPosition - this.buffer) - stepper[motorName].position
              console.log('adjusted steps')
            }
            if(stepper[motorName].position < this.maxPosition){
              stepper[motorName].isRunning = true;
              console.log('MOVING ** ' + motorName)
              stepper[motorName].motor.rpm(this.rpm).cw().accel(this.accel).decel(this.accel).step(steps, function(){
                console.log('DONE Moving!!!!!-  Motor: '+ motorName +'  steps:' + steps + '  dir: ' + dir )
                stepper[motorName].isRunning = false;
                stepper[motorName].position += steps
                console.log('position: ' + stepper[motorName].position)
                callback();
              });
            }
          }
        }
        else console.log('already running')
      },
}
