module.exports.createControllers = createControllers;
module.exports.getOverallStatus = getOverallStatus;

// Controller data structure
function Controller(name){
	this.status = 0; // 0 is closed, 1 is open
	this.name = name;
	this.id = Controller.prototype.makeid();
}

Controller.prototype.flip = function (){
	// TO-DO: flip
	this.status = 1 - this.status;
	return true;
}

Controller.prototype.turnOn = function (){
	//To-DO: turn on the light
	this.status = 1;
	return true;
}

Controller.prototype.turnOff = function (){
	// TO-DO: turn off the light
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
	var nameList = ["Living Room", "Master Bedroom", "Guest Bedroom", "Dining Room"];
	var newController;
	for(var i = 0; i < nameList.length; i++){
		newController = new Controller(nameList[i]);
		controllers[newController.id] = newController;
	}
	return controllers; 
}

function getOverallStatus(controllers){
	var overallStatus = false;
	for(var id in controllers){
		overallStatus = overallStatus || controllers[id].status;
	}
	return overallStatus;
}
