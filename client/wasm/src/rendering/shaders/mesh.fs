R"(#version 300 es
precision mediump float;
out vec4 fragColor;

layout(std140) uniform LightingInfo {
    vec3 lightPos;
    vec3 cameraPos;
};

in vec3 u_fragPos;
in vec3 u_normal;

void main() {
    vec3 color = vec3(0.9, 0.8, 0.7);

    vec3 normal = normalize(u_normal);

    float ambient = 0.05;

    vec3 lightDir = normalize(lightPos - u_fragPos);
    float diffuse = max(dot(lightDir, normal), 0.0);
    
    vec3 viewDir = normalize(cameraPos - u_fragPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
    spec *= 0.3;

    float strength = ambient + diffuse + spec;

    // apply steps
    if (strength > 0.9) {
        strength = 1.1;
    } else if (strength > 0.6) {
        strength = 0.8;
    } else if (strength > 0.2) {
        strength = 0.5;
    } else {
        strength = 0.2;
    }

    fragColor = vec4(color * strength, 1.0f);
}
)"