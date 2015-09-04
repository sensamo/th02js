# th02js
A Javascript Library for reading from the TH02 Temperature + Humidity Sensor.

## Install

```
> npm install th02js
```

## Usage

```
var TH02 = require('th02js');

var bus = 6; //Note: this works for Edison, for Raspberry Pi you may need to use MRAA I2C bus 0

var sensor = new TH02(bus);

```

### Temperature

```
var farenheit = sensor.getFarenheitTemp()
var celsius = sensor.getCelsiusTemp()
```

### Humidity

```
var humidity = sensor.getHumidity()
```