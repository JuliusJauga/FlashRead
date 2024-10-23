R"(#version 300 es
precision mediump float;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;

layout(std140) uniform Camera {
    mat4 projxview;
    vec2 nearFarPlane;
};

out vec3 u_color;

void main() {
    u_color = color;
    gl_Position = projxview * vec4(position, 1.0);
}
)"