R"(#version 300 es
precision mediump float;

out vec2 uv;
out vec3 color;

void main() {
    uv = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
    color = vec3(uv, 1.0);
	gl_Position = vec4(uv * 2.0 + -1.0, 0.0, 1.0);
}
)"