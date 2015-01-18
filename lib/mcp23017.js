"use strict";

var Cylon = require('cylon');

var Mcp23017 = module.exports = function Mcp23017(opts) {
    Mcp23017.__super__.constructor.apply(this, arguments);
    // Include a list of commands that will be made available to the device instance.
    // and used in the work block of the robot.
    this.commands = {
        // This is how you register a command function for the device;
        // the command should be added to the prototype, see below.
        hello: this.hello,
        init: this.init,
        readA: this.readA,
        writeA: this.writeA,
        readB: this.readB,
        writeB: this.writeB
    };

    this.address = 0x20;
};

Cylon.Utils.subclass(Mcp23017, Cylon.Driver);

Mcp23017.prototype.start = function (callback) {
    callback();
};

Mcp23017.prototype.halt = function (callback) {
    callback();
};

Mcp23017.prototype.hello = function () {
    Cylon.Logger.info('Hello World!');
    Cylon.Logger.info('address=' + this.address);
    Cylon.Logger.info('aInvert=' + this.aInvert);
    Cylon.Logger.info('bInvert=' + this.bInvert);
    Cylon.Logger.info('aOut=' + this.aOut);
    Cylon.Logger.info('bOut=' + this.bOut);
    Cylon.Logger.info('Pullup is always active for inputs.')
};

Mcp23017.prototype.init = function (a0a1a2, aOut, bOut, aInvert, bInvert) {
    Cylon.Logger.info('init');
    this.address = 0x20 + a0a1a2;
    this.aInvert = aInvert;
    this.bInvert = bInvert;
    if (aOut === true){
        this.connection.i2cWrite(this.address, 0, [0]); // Register=0=IODIRA => GPAx=Ausgang
        //this.connection.i2cWrite(this.address, 0x12, [0]); // Register=0x12=GPIOA => GPAx=0
    }else{
        this.connection.i2cWrite(this.address, 0, [0xff]); // Register=0 => GPAx=Eingang
        this.connection.i2cWrite(this.address, 0x0c, [0xff]); // Register=0x0c => GPPUA Pullup ein
    }

    if (bOut === true){
        this.connection.i2cWrite(this.address, 1, [0]); // Register=1=IODIRB => GPBx=Ausgang
        //this.connection.i2cWrite(this.address, 0x13, [0]); // Register=0x13=GPIOB => GPBx=0
    }else{
        this.connection.i2cWrite(this.address, 1, [0xff]); // Register=1 => GPBx=Eingang
        this.connection.i2cWrite(this.address, 0x0d, [0xff]); // Register=0x0d => GPPUB Pullup ein
    }
};

Mcp23017.prototype.readA = function (cb) {
    var self = this;
    this.connection.i2cRead(this.address, 0x12, 1, function (err, data) {
        if(data != null){
            if(self.aInvert){
                data[0] = ~data[0];
            }
            if(cb != null){
              cb(err, 0xff & data[0]);
            }
        }else{
            if(cb != null){
              cb(err, null);
            }
        }
    });
};

Mcp23017.prototype.writeA = function (out8, cb) {
    this.connection.i2cWrite(this.address, 0x12, [out8], cb); // Register=0x12=GPIOA => GPAx=0
};

Mcp23017.prototype.readB = function (cb) {
    var self = this;
    this.connection.i2cRead(this.address, 0x13, 1, function (err, data) {
        if(data != null){
            if(self.bInvert){
                data[0] = ~data[0];
            }
            if(cb != null){
              cb(err, 0xff & data[0]);
            }
        }else{
            if(cb != null){
              cb(err, null);
            }
        }
    });
};

Mcp23017.prototype.writeB = function (out8, cb) {
    this.connection.i2cWrite(this.address, 0x13, [out8], cb); // Register=0x13=GPIOB => GPBx=0
};
