#pragma once

#include <memory>
#include <deque>
#include <string>

#include "ShaderProgram.h"
#include "../core/Scene.h"
#include "UniformBuffer.h"
#include "Mesh.h"
#include "GBuffer.h"

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

    void ReloadShaders();
private:
    void LoadShaderFromFile(std::string file);
    void SetupUniforms();
    bool m_shadersLoading = false;
    std::deque<std::string> m_shaderLoadingQueue;
    std::deque<std::string> m_shaderLoadingOutput;
    std::deque<std::unique_ptr<ShaderProgram>*> m_shaderLoadingPrograms;

    uint32_t m_nextUniformBindingIndex = 0;
    uint32_t GetNextUniformBindingIndex() { return m_nextUniformBindingIndex++; }

    int32_t m_viewportWidth, m_viewportHeight;

    GBuffer m_gbuffer;

    std::unique_ptr<ShaderProgram> m_debugProgram;
    std::unique_ptr<ShaderProgram> m_meshProgram;
    std::unique_ptr<ShaderProgram> m_lightingProgram;

    constexpr static inline uint32_t m_matricesPerUniformBuffer = 256;
    struct MeshModelUniform {
        Mesh mesh;
        uint32_t instanceOffset;
        uint32_t instanceCount;
    };
    UniformBuffer<void> m_modelUniform;

    struct CameraUniform {
        glm::mat4 projxview;
        glm::vec2 nearFarPlane;
        float p1, p2;
    };
    UniformBuffer<CameraUniform> m_cameraUniform;

    struct LightingInfoUniform {
        glm::vec3 lightPos;
        float p1;
        glm::vec3 cameraPos;
        float p2;
        glm::vec2 viewportSize;
        float p3, p4;
    };
    UniformBuffer<LightingInfoUniform> m_lightingInfoUniform;
};