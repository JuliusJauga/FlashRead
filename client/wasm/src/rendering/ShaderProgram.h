#pragma once

#include <SDL2/SDL_opengles2.h>

class ShaderProgram {
public:
    ShaderProgram(const GLchar* vertexSource, const GLchar* fragmentSource);
    ~ShaderProgram();
    ShaderProgram(const ShaderProgram&) = delete;
    ShaderProgram& operator=(const ShaderProgram&) = delete;
    ShaderProgram(ShaderProgram&&) = delete;
    ShaderProgram& operator=(ShaderProgram&&) = delete;

    void Use();
    GLuint GetId() const { return m_program; }

private:
    GLuint m_program;
};