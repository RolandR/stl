
var renderer = new Renderer("renderCanvas");
var controls;

var file = "./cube_high.stl";

loadFile(file, function(response){
	parseSTL(response);
});

function parseSTL(stl){
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
	
	var max = 0;
	var min = 0;
	var span = 0;
	
	var maxes = [0, 0, 0];
	var mins = [0, 0, 0];
	var spans = [0, 0, 0];
	
	for(var i = 0; i < vertices.length; i++){
		vertices[i] = parseFloat(vertices[i].trim());
		
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
	
	console.log(max, min, span);
	
	for(var i = 0; i < vertices.length; i++){
		var n = i%3;
		
		vertices[i] = vertices[i] - spans[n]/2;
		vertices[i] = vertices[i]/span;
		//vertices[i] = vertices[i]/3;
		/*if(i%3 == 0){
			vertices[i]++;
		}*/
	}
	
	for(var i = 0; i < normals.length; i++){
		normals[i] = parseFloat(normals[i].trim());
	}
	
	vertices = Float32Array.from(vertices);
	normals = Float32Array.from(normals);
	
	//.log(lines);
	//console.log(vertices);
	//console.log(normals);
	
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