var 	gpio = require('onoff').Gpio,
	sleep = require('sleep');

// Controller data structure
function PiezoController(name, pin){
	this.name = name;
	this.pizeo = new gpio(pin, 'out');
	this.pizeo.writeSync(1);// 1 == off, 0 == on
}

PiezoController.prototype.beep = function (){
	var tone = 1915, duration = 3830		
	for(var i = 0;  i < duration*200; i+= 2*tone){
		this.pizeo.writeSync(0);
		sleep.usleep(tone);
		this.pizeo.writeSync(1);
	}
	this.pizeo.writeSync(1);
	return true;
}

module.exports.PiezoController = PiezoController;

