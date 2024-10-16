#pragma once

#include <string_view>
#include <GLES3/gl3.h>
#include <unordered_map>
#include <string>

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

    void SetTexture(std::string_view name, GLuint index, GLuint texture);

private:
    GLuint m_program;
    std::unordered_map<std::string, GLuint> m_uniformLocations;
};