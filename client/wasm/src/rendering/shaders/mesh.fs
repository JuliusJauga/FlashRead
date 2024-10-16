R"(#version 300 es
precision mediump float;

layout (location = 0) out vec4 gPosition;
layout (location = 1) out vec4 gColor;
layout (location = 2) out vec4 gNormal;

layout(std140) uniform Camera {
    mat4 projxview;
    vec2 nearFarPlane;
};

in vec3 u_fragPos;
in vec3 u_normal;

float linearDepth(float depth) {
    float near = nearFarPlane.x;
    float far = nearFarPlane.y;
    float z = depth * 2.0 - 1.0; // back to NDC
    return (2.0 * near * far) / (far + near - z * (far - near));
}

void main() {
    gPosition = vec4(u_fragPos, linearDepth(gl_FragCoord.z));
    gColor = vec4(0.9, 0.8, 0.7, 1.0);
    gNormal = vec4(normalize(u_normal), 1.0);
}
)"