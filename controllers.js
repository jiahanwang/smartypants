module.exports.createControllers = createControllers;
module.exports.getOverallStatus = getOverallStatus;

var gpio = require('onoff').Gpio;

// Controller data structure
function Controller(name, pin){
	this.status = 0; // 0 is off, 1 is on, which is different from gpio object
	this.name = name;
	this.id = Controller.prototype.makeid();
	this.light = new gpio(pin, 'out');
	this.light.writeSync(1);// 1 == off, 0 == on
}

Controller.prototype.flip = function (){
	// TO-DO: flip
	this.light.writeSync(this.status);
	this.status = 1 - this.status;
	return true;
}

Controller.prototype.turnOn = function (){
	//To-DO: turn on the light
	this.light.writeSync(0);
	this.status = 1;
	return true;
}

Controller.prototype.turnOff = function (){
	// TO-DO: turn off the light
	this.light.writeSync(1);
	this.status = 0;
	return true;
}

Controller.prototype.makeid = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i = 0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}


function createControllers(){
	var controllers = {};
	var nameList = [["Living Room", 23], ["Master Bedroom", 24], ["Guest Bedroom", 25]];
	var newController;
	for(var i = 0; i < nameList.length; i++){
		newController = new Controller(nameList[i][0], nameList[i][1]);
		controllers[newController.id] = newController;
	}
	return controllers;
}

function getOverallStatus(controllers){
	var overallStatus = false;
	for(var id in controllers){
		overallStatus = overallStatus || controllers[id].status;
		//console.log('controller: ' + controllers[id].status);
	}
	return overallStatus;
}
