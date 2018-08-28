var fragmentShader = `
precision mediump float;
//varying lowp vec4 vColor;
varying highp vec3 lighting;
varying float fogness;
void main(void){
	vec3 color = vec3(0.5, 0.5, 1.0);
	color = color * lighting;
	gl_FragColor = vec4(color, 1.0);
}
`;