var m = require('mraa');
var util = require('util');

var ADDRESS = 0x40;

var TH02_REG_STATUS = 0x00;
var TH02_REG_DATA_H = 0x01;
var TH02_REG_DATA_L = 0x02;
var TH02_REG_CONFIG = 0x03;
var TH02_REG_ID = 0x11;

var TH02_STATUS_RDY_MASK = 0x01;

var TH02_CMD_MEASURE_HUMI = 0x01;
var TH02_CMD_MEASURE_TEMP = 0x11;

var SUCCESS = 0;

var TH02 = function(bus) {
    this._address = ADDRESS;
    this._bus = bus;
    this.reset();
};

TH02.prototype.getRawTemperature = function () {
    var temperature = 0;
    if (this.x.writeReg(TH02_REG_CONFIG, TH02_CMD_MEASURE_TEMP)) {
        console.log('Write failed');
        return 0.0;
    }
    
     /* Wait until conversion is done */
    while (this.getStatus() === false);
    
    temperature = this.x.readReg(TH02_REG_DATA_H); 
    temperature = temperature << 8;
    temperature |= this.x.readReg(TH02_REG_DATA_L);
    temperature >>= 2;
    
    return parseFloat(temperature);
};

TH02.prototype.getHumidity = function () {
    var humidity = 0;
    if (this.x.writeReg(TH02_REG_CONFIG, TH02_CMD_MEASURE_HUMI)) {
        console.log('Write failed');
        return 0.0;
    }
    
     /* Wait until conversion is done */
    while (this.getStatus() === false);
    
    humidity = this.x.readReg(TH02_REG_DATA_H); 
    humidity = humidity << 8;
    humidity |= this.x.readReg(TH02_REG_DATA_L);
    humidity >>= 4;
    
    return (parseFloat(humidity)/16.0)-24.0;;
};

TH02.prototype.getCelsiusTemp = function () {
    var temp = this.getRawTemperature();
    return ((parseFloat(temp) / 32.0) - 50.0);
}

TH02.prototype.getFarenheitTemp = function () {
    var temp = this.getRawTemperature();
    return (((parseFloat(temp) / 32.0) - 50.0) * (9/5) + 32);
}

TH02.prototype.reset = function () {
    this.x = new m.I2c(this._bus);
    var res = this.x.address(this._address);
    if(res != SUCCESS)
        throw new Error('Unexpected response from TH02');
}

TH02.prototype.getStatus = function () {
    var status = this.x.readReg(TH02_REG_STATUS);
    if (status & TH02_STATUS_RDY_MASK)
        return false;           // NOT ready
    else
        return true;            // ready
};

module.exports = TH02;
