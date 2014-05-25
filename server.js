var http = require('http'),
	fs = require('fs'),
	path = require('path'),
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
	};

module.exports.start = createServer;
	
function requestHandler(req, res){
	switch(req.method){
		case "POST": 
			postHander(req, res);
			break;
		case "GET":
		default: 
			getHandler(req, res);
			break;
	}
}

function postHandler(req, res){
	// to be implemented
	respondServerError(501, res);
}

function getHandler(req, res){
	var fileName = path.basename(req.url) || 'index.html',
	ext = path.extname(fileName);
	localPath = __dirname + '/public' + path.dirname(req.url) + '/' + fileName;
	console.log("Getting " + localPath);
	if(!extensions[ext]){
		respondClientError(404, res);
	}else{
		respondContent(localPath, extensions[ext], res);
	}

}

function respondContent(filePath, mimeType, res){
	fs.exists(filePath, function(exists){
		if(exists){
			fs.readFile(filePath, function(err, data){
				if(err){
					respondServerError(404, res);
				} 
				else{
					res.writeHead(200, {'Content-type' : mimeType, 'Conten-length': data.length});
					res.end(data);
				}
			});
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
	http.createServer(requestHandler).listen(3000);
	console.log("HTTP server is listening on 3000 ...");
}





