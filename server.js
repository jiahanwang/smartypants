var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	nfc = require('./nfc.js'),
	extensions = {
		".html" : "text/html",
		".css" : "text/css",
		".js" : "application/javascript",
		".json" : "application/json",
		".png" : "image/png",
		".gif" : "image/gif",
		".jpg" : "image/jpeg",
		".woff" : "application/font-woff",
		".ttf" : "application/x-font-ttf",
		".svg" : "image/svg+xml",
		".eot": "application/vnd.ms-fontobject"
	},
	controllers = null;

module.exports.start = createServer;
	
function requestHandler(req, res){
	switch(req.method){
		case "POST": 
			postHandler(req, res);
			break;
		case "GET":
		default: 
			getHandler(req, res);
			break;
	}
}

function postHandler(req, res){
	// to be implemented
	var body = '';
	req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
		body = JSON.parse(body);
		var responseData = null;
		if(body.mode === 'all'){
			try{
				if(body.todo === 'on'){
					for(var id in controllers){
						controllers[id].turnOn();
					}
				}else{
					for(var id in controllers){
						controllers[id].turnOff();
					}
				}
				responseData = {"mode" : "all", "success": true};
			}catch(err){
				responseData = {"mode" : "all", "success": false};
			}
			responseData = JSON.stringify(responseData);
			res.writeHead(200, {'Content-type' : "application/json", 'Conten-length': responseData.length});
			res.end(responseData);
		} else if (body.mode === 'single'){
			try{
				if(body.todo === 'on'){
					controllers[body.id].turnOn();
				}else{
					controllers[body.id].turnOff();
				}
				responseData = {"mode" : "single", "id" : body.id, "overall_status" : nfc.getOverallStatus(controllers), "success": true};
			}catch(err){
				responseData = {"mode" : "single", "id" : body.id, "overall_status" : nfc.getOverallStatus(controllers), "success": false};
			}
			responseData = JSON.stringify(responseData);
			res.writeHead(200, {'Content-type' : "application/json", 'Conten-length': responseData.length});
			res.end(responseData);
		}else if (body.mode === 'polling'){
			try{
				responseData = {"mode" : "polling", "statusArray" : {}};
				for(var id in controllers){
					responseData.statusArray[id] = controllers[id].status;
				}
				responseData.overall_status =  nfc.getOverallStatus(controllers);
				responseData.success = true;
			}catch(err){
				responseData = {"mode" : "polling", "success": false};
			}
			responseData = JSON.stringify(responseData);
			res.writeHead(200, {'Content-type' : "application/json", 'Conten-length': responseData.length});
			res.end(responseData);
		}else{
			respondServerError(501, res);
		}
    });
	
}

function getHandler(req, res){
	var fileName = path.basename(req.url) || 'index.html',
	ext = path.extname(fileName);
	localPath = __dirname + '/public' + path.dirname(req.url) + '/' + fileName;
	console.log('Getting ' + localPath);
	if(!extensions[ext]){
		respondClientError(404, res);
	}else{
		respondContent(localPath, extensions[ext], res);
	}
}

function respondContent(filePath, mimeType, res){
	fs.exists(filePath, function(exists){
		if(exists){
			if(path.basename(filePath) === 'index.html'){
				// build the index page
				fs.readFile(filePath, 'utf-8', function(err, data){
					if(err){
						respondServerError(404, res);
					} 
					else{
						var roomListHTML = '<ul id="roomList">';
						for( var id in controllers ){
							roomListHTML += '<li><span class="roomName">' 
											+ controllers[id].name 
											+ '</span><span class="switchButton"><input type="checkbox" class="js-switch" data-id="' 
											+ id + '"' 
											+ ( controllers[id].status === 1 ? 'checked' : 'unchecked')
											+'/></span></li>';
						}
						roomListHTML += "</ul>";
						data = data.replace(/<ul id="roomList"><\/ul>/i, roomListHTML);
						// change central button status
						if(!nfc.getOverallStatus(controllers)){
							data = data.replace(/class="circular"/i, 'class="circular off"');
						}
						res.writeHead(200, {'Content-type' : mimeType, 'Conten-length': data.length});
						res.end(data);
					}
				});
			}else{
				fs.readFile(filePath, function(err, data){
					if(err){
						respondServerError(404, res);
					} 
					else{
						res.writeHead(200, {'Content-type' : mimeType, 'Conten-length': data.length});
						res.end(data);
					}
				});
			}
		}else{
			respondClientError(res);
		}
	});
}

function respondClientError(errorCode, res){
	res.writeHead(errorCode, {'Content-Type': 'text/html'});
	var errorMsg = '';
	switch(errorCode){
		default: 
			errorMsg = "<!DOCTYPE html><html><body><h1>404</h1><h2>The page you are requesting doesn't exist.</h2></body></html>";
			break;
	}
	res.end(errorMsg);
}

function respondServerError(errorCode, res){
	res.writeHead(errorCode, {'Content-Type': 'text/html'});
	var errorMsg = '';
	switch(errorCode){
		case 501: 
			errorMsg = "<!DOCTYPE html><html><body><h1>501</h1><h2>Not Implemented</h2></body></html>";
			break;
		default: 
			errorMsg = "<!DOCTYPE html><html><body><h1>500</h1><h2>Internal Server Error</h2></body></html>";
			break;
	}
	res.end(errorMsg);
}

function createServer(){
	controllers = nfc.createControllers();
	http.createServer(requestHandler).listen(3000);
	console.log("HTTP server is listening on 3000 ...");
}





