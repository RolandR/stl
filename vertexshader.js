



var vertexShader = `

uniform mat4 model;
uniform mat4 view;
uniform mat4 perspective;
uniform mat4 normalTransform;
uniform float aspect;
uniform float maxDistance;

attribute vec3 coordinates;
attribute vec3 vertexNormal;

varying highp vec3 lighting;
varying float fogness;

void main(void){

	highp vec3 ambientLight = vec3(0.22, 0.25, 0.3);
    highp vec3 directionalLightColor = vec3(1.0, 1.0, 0.9);
    highp vec3 directionalVector = normalize(vec3(-1.0, 1.0, 1.0));
    directionalVector = (vec4(directionalVector, 1.0)*model).xyz;
    highp vec3 viewVector = normalize(vec3(0.0, 0.0, 1.0));
    viewVector = (vec4(viewVector, 1.0)*model).xyz;

	highp float directional = dot(normalize(vertexNormal), directionalVector);
	
	float specular = min(dot(viewVector.xyz, reflect(directionalVector, normalize(vertexNormal))), 0.0);
	specular = pow(specular, 4.0);
		
		
    lighting = ambientLight + (directionalLightColor * directional * 1.0) + (directionalLightColor * specular * 0.8);
    
    

	vec4 coords = vec4(coordinates, 1.0);

	coords = perspective * view * model * coords;
	
	fogness = clamp(length(coords)/maxDistance, 0.0, 1.0);

	gl_Position = coords;
}

`;