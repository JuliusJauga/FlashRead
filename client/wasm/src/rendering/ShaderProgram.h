#pragma once

#include <string_view>
#include <GLES3/gl3.h>

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

    void AddUniformBufferBinding(std::string_view name, GLuint bindingIndex);

private:
    GLuint m_program;
};