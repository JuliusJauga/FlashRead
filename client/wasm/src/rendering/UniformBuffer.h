#pragma once

#include <GLES3/gl3.h>

template <typename T = void>
class UniformBuffer {
public:
    UniformBuffer() {
        glGenBuffers(1, &m_ubo);
        glBindBuffer(GL_UNIFORM_BUFFER, m_ubo);
        if constexpr (!std::is_void_v<T>) {
            ResizeInternal(sizeof(T));
        }
    }
    ~UniformBuffer() {
        if (m_ubo != 0) glDeleteBuffers(1, &m_ubo);
    }
    UniformBuffer(const UniformBuffer&) = delete;
    UniformBuffer& operator=(const UniformBuffer&) = delete;
    UniformBuffer(UniformBuffer&& other) noexcept {
        m_ubo = other.m_ubo;
        m_bindIndex = other.m_bindIndex;
        other.m_ubo = 0;
    }
    UniformBuffer& operator=(UniformBuffer&& other) noexcept {
        if (this != &other) {
            if (m_ubo != 0) glDeleteBuffers(1, &m_ubo);
            m_ubo = other.m_ubo;
            m_bindIndex = other.m_bindIndex;
            other.m_ubo = 0;
        }
        return *this;
    }
    
    void SetBindingIndex(GLuint bindingIndex) { m_bindIndex = bindingIndex; }
    GLuint GetBindingIndex() const { return m_bindIndex; }
    uint32_t GetSize() const { return m_size; }

    void Bind() requires (!std::is_void_v<T>) {
        glBindBufferBase(GL_UNIFORM_BUFFER, m_bindIndex, m_ubo);
    }
    template<typename U = T>
    void Update(const U& data) requires (!std::is_void_v<T> && std::is_same_v<T, U>) {
        glBindBuffer(GL_UNIFORM_BUFFER, m_ubo);
        glBufferSubData(GL_UNIFORM_BUFFER, 0, m_size, &data);
    }
    
    void Bind(uint32_t offset, uint32_t range) requires (std::is_void_v<T>) {
        glBindBufferRange(GL_UNIFORM_BUFFER, m_bindIndex, m_ubo, offset, range);
    }
    void Update(GLintptr offset, GLsizeiptr size, const void* data) requires (std::is_void_v<T>) {
        glBindBuffer(GL_UNIFORM_BUFFER, m_ubo);
        glBufferSubData(GL_UNIFORM_BUFFER, offset, size, data);
    }
    void Resize(uint32_t size) requires (std::is_void_v<T>) {
        ResizeInternal(size);
    }
private:
    void ResizeInternal(uint32_t size) {
        glBindBuffer(GL_UNIFORM_BUFFER, m_ubo);
        glBufferData(GL_UNIFORM_BUFFER, size, nullptr, GL_DYNAMIC_DRAW);
        m_size = size;
    }

    GLuint m_ubo = 0;
    GLuint m_bindIndex = 0;
    uint32_t m_size = 0;
};