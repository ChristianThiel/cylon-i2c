"use strict";

var Cylon = require('cylon');

var Pcf8574a = module.exports = function Pcf8574a(opts) {
    Pcf8574a.__super__.constructor.apply(this, arguments);
    // Include a list of commands that will be made available to the device instance.
    // and used in the work block of the robot.
    this.commands = {
        // This is how you register a command function for the device;
        // the command should be added to the prototype, see below.
        hello: this.hello,
        init: this.init,
        read: this.read,
        write: this.write
    };

    this.address = 0x38;
};

Cylon.Utils.subclass(Pcf8574a, Cylon.Driver);

Pcf8574a.prototype.start = function (callback) {
    callback();
};

Pcf8574a.prototype.halt = function (callback) {
    callback();
};

Pcf8574a.prototype.hello = function () {
    Cylon.Logger.info('Hello World!');
    Cylon.Logger.info('address=' + this.address);
};

Pcf8574a.prototype.init = function (a0a1a2) {
    Cylon.Logger.info('init');
    this.address = 0x38 + a0a1a2;
};

Pcf8574a.prototype.writeRead = function (wr, cb) {
    var self = this;
    this.connection.i2cRead(this.address, wr, 1, function (err, data) {
        if(data != null){
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

Pcf8574a.prototype.write = function (out8, cb) {
    this.connection.i2cWrite(this.address, [out8], cb);
};
