R"(#version 300 es
precision mediump float;

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;

layout(std140) uniform Camera {
    mat4 view;
    mat4 projection;
};

layout(std140) uniform ModelMatrices {
    mat4 model[256];
};

out vec3 color;

void main() {
    color = vec3(1.0, 0.0, 0.0);
    gl_Position = projection * view * model[gl_InstanceID] * vec4(position, 1.0);
}
)"