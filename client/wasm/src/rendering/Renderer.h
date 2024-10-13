#pragma once

#include <memory>
#include "ShaderProgram.h"
#include "../core/Scene.h"
#include "UniformBuffer.h"
#include "Mesh.h"

class Renderer {
public:
    Renderer();
    ~Renderer();
    Renderer(const Renderer&) = delete;
    Renderer& operator=(const Renderer&) = delete;
    Renderer(Renderer&&) = delete;
    Renderer& operator=(Renderer&&) = delete;

    void Render(const std::shared_ptr<Scene>& scene);

    void SetViewportSize(int32_t width, int32_t height);

private:
    uint32_t m_nextUniformBindingIndex = 0;
    uint32_t GetNextUniformBindingIndex() { return m_nextUniformBindingIndex++; }

private:
    int32_t m_viewportWidth, m_viewportHeight;

    std::unique_ptr<ShaderProgram> m_postProcessingProgram;
    std::unique_ptr<ShaderProgram> m_meshProgram;

    struct CameraUniform {
        glm::mat4 view;
        glm::mat4 projection;
    };
    UniformBuffer<CameraUniform> m_cameraUniform;

    constexpr static inline uint32_t m_matricesPerUniformBuffer = 256;
    struct BatchRenderData {
        Mesh mesh;
        uint32_t instanceOffset;
        uint32_t instanceCount;
    };
    UniformBuffer<void> m_modelUniform;
};