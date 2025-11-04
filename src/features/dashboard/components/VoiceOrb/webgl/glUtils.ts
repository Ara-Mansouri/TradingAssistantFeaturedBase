/* Minimal WebGL2 helpers for VoiceOrb */

export function createWebGL2Context(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
	const gl = canvas.getContext('webgl2', {
		alpha: true,
		antialias: true,
		premultipliedAlpha: false,
		preserveDrawingBuffer: false,
		powerPreference: 'high-performance',
	}) as WebGL2RenderingContext | null;
	return gl;
}

export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) throw new Error('Failed to create shader');
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const info = gl.getShaderInfoLog(shader) || 'Unknown shader compile error';
		gl.deleteShader(shader);
		throw new Error(info);
	}
	return shader;
}

export function createProgram(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string): WebGLProgram {
	const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
	const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
	const program = gl.createProgram();
	if (!program) throw new Error('Failed to create program');
	gl.attachShader(program, vert);
	gl.attachShader(program, frag);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		const info = gl.getProgramInfoLog(program) || 'Unknown program link error';
		gl.deleteProgram(program);
		gl.deleteShader(vert);
		gl.deleteShader(frag);
		throw new Error(info);
	}
	gl.deleteShader(vert);
	gl.deleteShader(frag);
	return program;
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, devicePixelRatio = window.devicePixelRatio || 1): boolean {
	const width = Math.max(1, Math.floor(canvas.clientWidth * devicePixelRatio));
	const height = Math.max(1, Math.floor(canvas.clientHeight * devicePixelRatio));
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
		return true;
	}
	return false;
}

export function setFullscreenQuad(gl: WebGL2RenderingContext): { vao: WebGLVertexArrayObject | null; buffer: WebGLBuffer | null } {
	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	const vertices = new Float32Array([
		-1, -1, 0, 0,
		 1, -1, 1, 0,
		-1,  1, 0, 1,
		-1,  1, 0, 1,
		 1, -1, 1, 0,
		 1,  1, 1, 1,
	]);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(0);
	gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
	gl.enableVertexAttribArray(1);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
	gl.bindVertexArray(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return { vao, buffer };
}

export function disposeGl(gl: WebGL2RenderingContext, resources: { program?: WebGLProgram | null; vao?: WebGLVertexArrayObject | null; buffer?: WebGLBuffer | null; }): void {
	if (resources.program) gl.deleteProgram(resources.program);
	if (resources.vao) gl.deleteVertexArray(resources.vao);
	if (resources.buffer) gl.deleteBuffer(resources.buffer);
}




