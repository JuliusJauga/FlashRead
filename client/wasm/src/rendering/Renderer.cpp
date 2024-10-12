#include "Renderer.h"

Renderer::Renderer() {
    // load shaders
    const GLchar vertexSource[] = {
    #include "shaders/main.vs"
    };
    const GLchar fragmentSource[] = {
    #include "shaders/main.fs"
    };
    mainProgram = std::make_unique<ShaderProgram>(vertexSource, fragmentSource);

    // set GL parameters
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);


    // for testing
    GLuint vbo;
    glGenBuffers(1, &vbo);
    glBindBuffer(GL_ARRAY_BUFFER, vbo);
    GLfloat vertices[] = {
        0.0f, 0.5f, 0.0f,
        -0.5f, -0.5f, 0.0f,
        0.5f, -0.5f, 0.0f
    };
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    GLint posAttrib = glGetAttribLocation(mainProgram->GetId(), "position");
    glEnableVertexAttribArray(posAttrib);
    glVertexAttribPointer(posAttrib, 3, GL_FLOAT, GL_FALSE, 0, 0);
}

Renderer::~Renderer() {}

void Renderer::Render() {
    glClear(GL_COLOR_BUFFER_BIT);

    mainProgram->Use();
    glDrawArrays(GL_TRIANGLES, 0, 3);
}