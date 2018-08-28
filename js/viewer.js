
var renderer = new Renderer("renderCanvas");
var controls;

var file = "./stl/dna.stl";

loadFile(file, function(response){
	detectBinary(response);
});

function detectBinary(stl){
	stlView = new DataView(stl);
	
	var header = "";
	
	for(var i = 0; i < 80; i++){
		header += String.fromCharCode(stlView.getUint8(i));
	}
	
	var binary = true;
	if(header.match(/^\s*solid/i)){
		binary = false;
	}
	
	if(binary){
		console.info("Detected binary STL file");
		parseBinaryStl(stlView);
	} else {
		
		console.info("Detected ASCII STL file");
		
		var stlString = "";
		
		if("TextDecoder" in window){
			var enc = new TextDecoder("utf-8");
			stlString = enc.decode(stlView);
		} else {
			console.warning("TextDecoder not supported, falling back to Array.reduce and String.fromCharCode...");
			var arr = new Uint8Array(stl);
			stlString = arr.reduce(function(str, charIndex) {
				return str + String.fromCharCode(charIndex);
			});
		}
		
		parseAsciiStl(stlString);
	}
}


function parseBinaryStl(stl){
	
	var length = stl.getUint32(80, true);
	
	var normals = [];
	var vertices = new Float32Array(length*3*3);
	
	var byteOffset = 84;
	var vert = 0;
	var norm = 0;
	
	for(var i = 0; i < length; i++){
		var n = [];
		for(var b = 0; b < 3; b++){
			n.push(stl.getFloat32(byteOffset, true));
			byteOffset += 4;
		}
		normals.push(n[0], n[1], n[2]);
		normals.push(n[0], n[1], n[2]);
		normals.push(n[0], n[1], n[2]);
		
		for(var a = 0; a < 3; a++){
			for(var v = 0; v < 3; v++){
				vertices[vert] = stl.getFloat32(byteOffset, true);
				byteOffset += 4;
				vert++;
			}
		}
		
		byteOffset += 2;
	}
	
	normals = Float32Array.from(normals);
	
	process3dData(vertices, normals);
}

function parseAsciiStl(stl){
	var lines = stl.split("\n");
	
	for(var i = 0; i < lines.length; i++){
		lines[i] = lines[i].trim().split(/\s+/);
	}
	
	var normals = [];
	var vertices = [];
	
	var i = 0;
	while(i < lines.length){
		
		if(lines[i][0] == "facet"){
			var three = 3;
			while(three--){
				normals.push(lines[i][2], lines[i][3], lines[i][4]);
			}
			
			i += 2;
			
			var three = 3;
			while(three--){
				vertices.push(lines[i][1], lines[i][2], lines[i][3]);
				i++;
			}
			
		} else {
			i++;
		}
	}
	
	for(var i = 0; i < vertices.length; i++){
		vertices[i] = parseFloat(vertices[i].trim());
	}
	
	for(var i = 0; i < normals.length; i++){
		normals[i] = parseFloat(normals[i].trim());
	}
	
	vertices = Float32Array.from(vertices);
	normals = Float32Array.from(normals);
	
	process3dData(vertices, normals);
}

function process3dData(vertices, normals){
	
	var max = 0;
	var min = 0;
	var span = 0;
	
	var maxes = [0, 0, 0];
	var mins = [0, 0, 0];
	var spans = [0, 0, 0];
	
	for(var i = 0; i < vertices.length; i++){
		
		if(!vertices[i]){
			vertices[i] = 0;
		}
		
		var n = i % 3;
		
		maxes[n] = Math.max(maxes[n], vertices[i]);
		mins[n] = Math.min(mins[n], vertices[i]);
		spans[n] = Math.abs(maxes[n]) - Math.abs(mins[n]);
		
	}
	
	max = maxes.reduce(function(a, b) {
		return Math.max(a, b);
	});
	min = mins.reduce(function(a, b) {
		return Math.min(a, b);
	});
	span = spans.reduce(function(a, b) {
		return Math.max(a, b);
	});
	
	var span = max - min;
	
	//console.log(max, min, span);
	
	for(var i = 0; i < vertices.length; i++){
		var n = i%3;
		
		vertices[i] = vertices[i] - spans[n]/2;
		vertices[i] = vertices[i] / span;
		
	
	}
	
	renderer.addVertices(vertices, normals);
	
	controls = new Controls();
	
	//renderer.render();
}

function loadFile(url, callback){
	
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4){
			callback(xmlhttp.response, xmlhttp.status, url);
		}
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.responseType = "arraybuffer";
	xmlhttp.send();
	
}