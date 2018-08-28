

function Controls(){
	
	var canvas = document.getElementById("renderCanvas");

	var position = [0, 0, -1];
	var rotationX = 0;
	var rotationY = 0;
	var currentRotationX = 0;
	var currentRotationY = 0;

	var mouseDown = false;
	var startX = 0;
	var startY = 0;

	var fieldOfViewInRadians = 50/180*Math.PI;
	var aspectRatio = canvas.width/canvas.height;
	var near = 0.001;
	var far = 2;

	var sin = Math.sin;
	var cos = Math.cos;

	update();

	function update(){

		var viewTransforms = [];

		viewTransforms.push([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
		
		viewTransforms.push([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			position[0], position[1], position[2], 1
		]);

		var view = multiplyArrayOfMatrices(viewTransforms);

		var modelTransforms = [[
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]];
		
		/*modelTransforms.push([
			1, 0, 0, position[0],
			0, 1, 0, position[1],
			0, 0, 1, position[2],
			0, 0, 0, 1
		]);*/
		
		var a = rotationY + currentRotationY;
		modelTransforms.push([
			 cos(a),   0, sin(a),   0,
				  0,   1,      0,   0,
			-sin(a),   0, cos(a),   0,
				  0,   0,      0,   1
		]);

		a = rotationX + currentRotationX;
		modelTransforms.push([
			1,       0,        0,     0,
			0,  cos(a),  -sin(a),     0,
			0,  sin(a),   cos(a),     0,
			0,       0,        0,     1
		]);
		
		var model = multiplyArrayOfMatrices(modelTransforms);

		var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
		var rangeInv = 1 / (near - far);

		var perspective = [
			f / aspectRatio, 0,                          0,   0,
			0,               f,                          0,   0,
			0,               0,    (near + far) * rangeInv,  -1,
			0,               0,  near * far * rangeInv * 2,   0
		];


		renderer.render(model, view, perspective);
	}

	window.addEventListener("mousedown", function(e){
		startX = e.clientX;
		startY = e.clientY;
		mouseDown = true;
		e.preventDefault();
	});

	window.addEventListener("mousemove", function(e){
		if(mouseDown){
			var deltaX = startX-e.clientX;
			var deltaY = startY-e.clientY;

			currentRotationY = deltaX/100;
			currentRotationX = deltaY/100;
			
			update();
			
			e.preventDefault();
		}
	});

	window.addEventListener("mouseup", function(e){
		mouseDown = false;
		rotationX += currentRotationX;
		rotationY += currentRotationY;
		e.preventDefault();
	});



	
}