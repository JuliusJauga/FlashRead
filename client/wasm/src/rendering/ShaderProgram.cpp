#include "ShaderProgram.h"

#include <stdio.h>

static void CheckCompileErrors(const unsigned int shader, const int type) {
    int success;
    char infoLog[1024];
    if (type == 1) {
        glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
        if (!success) {
            glGetShaderInfoLog(shader, 1024, nullptr, infoLog);
            printf("ERROR::SHADER_COMPILATION_ERROR:\n %s\n", infoLog);
        }
    } else {
        glGetProgramiv(shader, GL_LINK_STATUS, &success);
        if (!success) {
            glGetProgramInfoLog(shader, 1024, nullptr, infoLog);
            printf("ERROR::PROGRAM_LINKING_ERROR:\n %s\n", infoLog);
        }
    }
}

static void CreateShader(GLuint program, const GLchar *source, GLenum type) {
    GLuint shader = glCreateShader(type);
    glShaderSource(shader, 1, &source, nullptr);
    glCompileShader(shader);
    CheckCompileErrors(shader, 1);
    glAttachShader(program, shader);
    glDeleteShader(shader);
}

ShaderProgram::ShaderProgram(const GLchar *vertexSource, const GLchar *fragmentSource) {
    m_program = glCreateProgram();

    if (vertexSource) CreateShader(m_program, vertexSource, GL_VERTEX_SHADER);
    if (fragmentSource) CreateShader(m_program, fragmentSource, GL_FRAGMENT_SHADER);
    glLinkProgram(m_program);
    CheckCompileErrors(m_program, 0);
}

ShaderProgram::~ShaderProgram() {
    glDeleteProgram(m_program);
}

void ShaderProgram::Use() {
    glUseProgram(m_program);
}

void ShaderProgram::AddUniformBufferBinding(std::string_view name, GLuint bindingIndex) {
    GLuint blockIndex = glGetUniformBlockIndex(m_program, name.data());
    if (blockIndex == GL_INVALID_INDEX) {
        printf("ERROR::SHADER_UNIFORM_BLOCK_NOT_FOUND: %s\n", name.data());
        return;
    }
    glUniformBlockBinding(m_program, blockIndex, bindingIndex);   
}
