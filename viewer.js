
var renderer = new Renderer("renderCanvas");
var controls;

var file = "./turbine.stl";

loadFile(file, function(response){
	parseSTL(response);
});

function parseSTL(stl){
	var lines = stl.split("\n");
	
	for(var i = 0; i < lines.length; i++){
		lines[i] = lines[i].split(" ");
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
	
	var max = 0;
	
	for(var i = 0; i < vertices.length; i++){
		vertices[i] = parseFloat(vertices[i]);
		max = Math.max(max, vertices[i]);
	}
	
	for(var i = 0; i < vertices.length; i++){
		vertices[i] = vertices[i]/max;
		vertices[i] = vertices[i]/10;
		/*if(i%3 == 0){
			vertices[i]++;
		}*/
	}
	
	for(var i = 0; i < normals.length; i++){
		normals[i] = parseFloat(normals[i]);
	}
	
	vertices = Float32Array.from(vertices);
	normals = Float32Array.from(normals);
	
	console.log(lines);
	console.log(vertices);
	console.log(normals);
	
	renderer.addVertices(vertices, normals);
	
	controls = new Controls();
	
	//renderer.render();
}


function loadFile(url, callback){
	
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4){
			callback(xmlhttp.responseText, xmlhttp.status, url);
		}
	};
	
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	
}