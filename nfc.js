module.exports.start = createControllers;

function Controller(name){
	this.status = 0; // 0 is closed, 1 is open
	this.name = name;
}

Controller.prototype.changeStatus = function (){
	// change the status
	this.status = 1 - this.status;
	return true;
}

function createControllers(){
	var controllers = [];
	controllers.push(new Controller('Living Room'));
	controllers.push(new Controller('Master Bedroom'));
	controllers.push(new Controller('Guest Bedroom'));
	controllers.push(new Controller('Kitchen Room'));
	return controllers; 
}
