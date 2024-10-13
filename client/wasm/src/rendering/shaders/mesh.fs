R"(#version 300 es
precision mediump float;
out vec4 fragColor;

in vec2 uv;
in vec3 color;

void main() {
    fragColor = vec4(color, 1.0f);
}
)"