R"(#version 300 es
precision mediump float;

layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;

layout(std140) uniform Camera {
    mat4 projxview;
    vec2 nearFarPlane;
};

layout(std140) uniform ModelMatrices {
    mat4 model[256];
};

out vec3 u_fragPos;
out vec3 u_normal;

void main() {
    vec4 pos = model[gl_InstanceID] * vec4(position, 1.0);
    gl_Position = projxview * pos;

    u_normal = transpose(inverse(mat3(model[gl_InstanceID]))) * normal;
    u_fragPos = pos.xyz;
}
)"