R"(#version 300 es
precision mediump float;
out vec4 gColor;

uniform sampler2D tPosition;
uniform sampler2D tColor;
uniform sampler2D tNormal;

layout(std140) uniform LightingInfo {
    vec3 lightPos;
    vec3 cameraPos;
    vec2 viewportSize;
};

in vec2 uv;

float sobel(mat3 vars) {
    mat3 sobelY = mat3( 
        1.0, 0.0, -1.0, 
        2.0, 0.0, -2.0, 
        1.0, 0.0, -1.0 
    );
    mat3 sobelX = mat3( 
        1.0, 2.0, 1.0, 
        0.0, 0.0, 0.0, 
        -1.0, -2.0, -1.0 
    );
    float gx = dot(sobelX[0], vars[0]) + dot(sobelX[1], vars[1]) + dot(sobelX[2], vars[2]); 
    float gy = dot(sobelY[0], vars[0]) + dot(sobelY[1], vars[1]) + dot(sobelY[2], vars[2]);
    return sqrt(pow(gx, 2.0) + pow(gy, 2.0));
}

void main() {
    vec3 position = texture(tPosition, uv).rgb;
    vec3 color = texture(tColor, uv).rgb;
    vec3 normal = texture(tNormal, uv).rgb;

    if (length(normal) < 0.8) {
        gColor = vec4(color, 1.0);
        return;
    }

    // lighting
    float ambient = 0.08;

    // vec3 lightDir = normalize(lightPos - position);
    vec3 lightDir = normalize(vec3(-1000, 2000, -800) - position);
    float diffuse = max(dot(lightDir, normal), 0.0);
    
    vec3 viewDir = normalize(cameraPos - position);
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    float spec = pow(max(dot(normal, halfwayDir), 0.0), 32.0);
    spec *= 0.3;
    spec *= 0.0;

    float strength = ambient + diffuse + spec;
    strength = floor(strength * 5.0) / 6.0 + 0.3;
    color *= strength;

    // sobel outline
    mat3 depths;
    for (int x = 0; x < 3; x++) {
        for (int y = 0; y < 3; y++) {
            depths[x][y] = texture(tPosition, uv + vec2(x, y) / viewportSize).w;
        }
    }
    float g = sobel(depths);
    g /= 120.f;
    color = mix(color, vec3(0), g);


    gColor = vec4(color, 1.0f);
}
)"