R"(
attribute vec4 position;

varying vec3 color;

void main() {
    gl_Position = vec4(position.xyz, 1.0);
    color = gl_Position.xyz + vec3(0.5);
}
)"