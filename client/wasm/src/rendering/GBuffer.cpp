#include "GBuffer.h"

#include <iostream>
#include <array>

GBuffer::GBuffer(uint32_t width, uint32_t height)
    : m_width{width}, m_height{height} {
    Create();
}
GBuffer::~GBuffer() {
    Destroy();
}

void GBuffer::Resize(uint32_t width, uint32_t height) {
    m_width = width;
    m_height = height;
    Destroy();
    Create();
}

void GBuffer::Create() {
	glGenFramebuffers(1, &m_fbo);
    glBindFramebuffer(GL_FRAMEBUFFER, m_fbo);
    glGenTextures(1, &m_texPosition);
    glGenTextures(1, &m_texColor);
    glGenTextures(1, &m_texNormal);
    glGenTextures(1, &m_texDepth);

    std::tuple<int, int, int> rgbaFormats[] = {
        {GL_RGBA32F, GL_RGBA, GL_FLOAT},
        // {GL_RGBA32UI, GL_RGBA_INTEGER, GL_UNSIGNED_INT}, TODO: support integer formats
    };
    for (auto&& [internal_format, format, type] : rgbaFormats) {
        glBindTexture(GL_TEXTURE_2D, m_texPosition);
        glTexImage2D(GL_TEXTURE_2D, 0, internal_format, m_width, m_height, 0, format, type, 0);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, m_texPosition, 0);

        glBindTexture(GL_TEXTURE_2D, m_texColor);
        glTexImage2D(GL_TEXTURE_2D, 0, internal_format, m_width, m_height, 0, format, type, 0);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT1, GL_TEXTURE_2D, m_texColor, 0);

        glBindTexture(GL_TEXTURE_2D, m_texNormal);
        glTexImage2D(GL_TEXTURE_2D, 0, internal_format, m_width, m_height, 0, format, type, 0);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT2, GL_TEXTURE_2D, m_texNormal, 0);

        constexpr GLuint attachments[] = {GL_COLOR_ATTACHMENT0, GL_COLOR_ATTACHMENT1, GL_COLOR_ATTACHMENT2};
        glDrawBuffers(3, attachments);

        glBindTexture(GL_TEXTURE_2D, m_texDepth);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_COMPARE_FUNC, GL_LEQUAL);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_COMPARE_MODE, GL_NONE);

        std::tuple<int, int, int> depthFormats[] = {
            {GL_DEPTH_COMPONENT32F, GL_DEPTH_COMPONENT, GL_FLOAT},
            {GL_DEPTH32F_STENCIL8, GL_DEPTH_STENCIL, GL_FLOAT_32_UNSIGNED_INT_24_8_REV},
            {GL_DEPTH_COMPONENT24, GL_DEPTH_COMPONENT, GL_UNSIGNED_INT},
            {GL_DEPTH24_STENCIL8, GL_DEPTH_STENCIL, GL_UNSIGNED_INT_24_8},
            {GL_DEPTH_COMPONENT16, GL_DEPTH_COMPONENT, GL_UNSIGNED_SHORT},
        };
        for (auto&& [d_internal_format, d_format, d_type] : depthFormats) {
            glTexImage2D(GL_TEXTURE_2D, 0, d_internal_format, m_width, m_height, 0, d_format, d_type, 0);
            glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_TEXTURE_2D, m_texDepth, 0);
            if (glCheckFramebufferStatus(GL_FRAMEBUFFER) == GL_FRAMEBUFFER_COMPLETE) {
                break;
            }
        }
        if (glCheckFramebufferStatus(GL_FRAMEBUFFER) == GL_FRAMEBUFFER_COMPLETE) break;
    }
    // Check Status
    if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
        std::cerr << "error while initializing GBuffer: " << glCheckFramebufferStatus(GL_FRAMEBUFFER) << '\n';
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
}
void GBuffer::Destroy() {
    glDeleteFramebuffers(1, &m_fbo);
    glDeleteTextures(1, &m_texDepth);
    glDeleteTextures(1, &m_texPosition);
    glDeleteTextures(1, &m_texColor);
    glDeleteTextures(1, &m_texNormal);
    m_fbo = 0;
    m_texDepth = 0;
    m_texPosition = 0;
    m_texColor = 0;
    m_texNormal = 0;
}