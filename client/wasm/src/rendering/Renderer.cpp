#include "Renderer.h"

#include <unordered_map>
#include <vector>
#include <glm/gtc/matrix_transform.hpp>
#include <emscripten/fetch.h>
#include <string.h>
#include <string>

#include "../core/Components.h"

Renderer::Renderer() {
    ReloadShaders();

    // GL settings
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    glEnable(GL_DEPTH_TEST);
    glDepthFunc(GL_LESS);

    glClearColor(0.5f, 0.4f, 0.3f, 1.0f);
}
Renderer::~Renderer() {}

void Renderer::ReloadShaders() {
#ifdef SHADER_HOT_RELOAD
#define SHADER_LOAD_FROM_FILE(target, shaderFile) \
    std::string target ## data; \
    { \
        bool finished; \
        std::pair<std::string*, bool*> userData = {&target ## data, &finished}; \
        emscripten_fetch_attr_t attr; \
        emscripten_fetch_attr_init(&attr); \
        strcpy(attr.requestMethod, "GET"); \
        attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY; \
        attr.userData = &userData; \
        attr.onsuccess = [](emscripten_fetch_t* fetch) { \
            auto userData = static_cast<std::pair<std::string*, bool*>*>(fetch->userData); \
            if (fetch->status == 200) { \
                *(userData->first) = std::string(fetch->data + 3, fetch->numBytes - (3 + 2)); \
            } else { \
                printf("Failed to load shader: %s\n", fetch->url); \
            } \
            *(userData->second) = true; \
            emscripten_fetch_close(fetch); \
        }; \
        attr.onerror = [](emscripten_fetch_t* fetch) { \
            auto userData = static_cast<std::pair<std::string*, bool*>*>(fetch->userData); \
            *(userData->second) = true; \
            emscripten_fetch_close(fetch); \
        }; \
        emscripten_fetch(&attr, "http://localhost:8000/" shaderFile); \
        while (!finished) { \
            emscripten_sleep(10); \
        } \
        target = target ## data.c_str(); \
        printf("loaded shader: %s\n", shaderFile); \
    }
#endif
    // mesh
    {
        #ifdef SHADER_HOT_RELOAD
            const GLchar* vertexSource;
            const GLchar* fragmentSource;
            SHADER_LOAD_FROM_FILE(vertexSource, "shaders/mesh.vs")
            SHADER_LOAD_FROM_FILE(fragmentSource, "shaders/mesh.fs")
        #else
            const GLchar vertexSource[] = {
                #include "shaders/mesh.vs"
            };
            const GLchar fragmentSource[] = {
                #include "shaders/mesh.fs"
            };
        #endif

        m_meshProgram = std::make_unique<ShaderProgram>(vertexSource, fragmentSource);
    }
    // // post
    // {
    //     const GLchar vertexSource[] = {
    //     #include "shaders/post.vs"
    //     };
    //     const GLchar fragmentSource[] = {
    //     #include "shaders/post.fs"
    //     };
    //     m_postProcessingProgram = std::make_unique<ShaderProgram>(vertexSource, fragmentSource);
    // }


    // setup uniforms
    m_cameraUniform.SetBindingIndex(GetNextUniformBindingIndex());
    m_meshProgram->AddUniformBufferBinding("Camera", m_cameraUniform.GetBindingIndex());
    m_cameraUniform.Bind();

    m_lightingInfoUniform.SetBindingIndex(GetNextUniformBindingIndex());
    m_meshProgram->AddUniformBufferBinding("LightingInfo", m_lightingInfoUniform.GetBindingIndex());
    m_lightingInfoUniform.Bind();

    m_modelUniform.SetBindingIndex(GetNextUniformBindingIndex());
    m_meshProgram->AddUniformBufferBinding("ModelMatrices", m_modelUniform.GetBindingIndex());
}

void Renderer::Render(const std::shared_ptr<Scene> &scene) {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    // update uniforms
    auto& camera = scene->GetCamera();
    camera->Update(m_viewportWidth, m_viewportHeight);
    m_cameraUniform.Update({
        .view = camera->GetViewMatrix(),
        .projection = camera->GetProjectionMatrix()
    });
    m_lightingInfoUniform.Update({
        .lightPos = scene->sunPosition,
        .cameraPos = camera->position,
    });

    // render entities
    {
        // get renderable meshes and matrices
        uint32_t matrixCount = 0;
        std::unordered_map<Mesh, std::vector<glm::mat4>> meshMatrices;
        auto view = scene->registry.view<MeshComponent>();
        for(auto entity : view) {
            matrixCount++;
            // get model matrix
            glm::mat4 model{1};
            if (auto transform = scene->registry.try_get<TransformComponent>(entity)) {
                model = glm::translate(model, transform->position);
                model = glm::scale(model, transform->scale);
                model = glm::rotate(model, transform->rotation.x, glm::vec3(1, 0, 0));
                model = glm::rotate(model, transform->rotation.y, glm::vec3(0, 1, 0));
                model = glm::rotate(model, transform->rotation.z, glm::vec3(0, 0, 1));
            }

            // add to map
            auto& mesh = view.get<MeshComponent>(entity);
            meshMatrices[mesh.mesh].push_back(model);
        }

        // batch matrices and get render data
        std::vector<glm::mat4> batchedMatrices; // TODO: possible to avoid copying matrices into this single vector, but more complex
        batchedMatrices.reserve(matrixCount);
        std::vector<BatchRenderData> batches;
        uint32_t currentUboOffset = 0;
        uint32_t currentBatchSize = 0;
        for (auto& [mesh, models] : meshMatrices) {
            batchedMatrices.insert(batchedMatrices.end(), models.begin(), models.end());
            uint32_t matricesLeft = models.size();
            while (matricesLeft > 0) {
                const uint32_t matricesInThisBatch = std::min(matricesLeft, m_matricesPerUniformBuffer - currentBatchSize);
                matricesLeft -= matricesInThisBatch;
                currentBatchSize = (currentBatchSize + matricesInThisBatch) % m_matricesPerUniformBuffer;

                BatchRenderData batchData;
                batchData.mesh = mesh;
                batchData.instanceOffset = currentUboOffset;
                batchData.instanceCount = matricesInThisBatch;
                batches.push_back(batchData);

                currentUboOffset += matricesInThisBatch; 
            }
        }
        // resize ubo if needed
        const uint32_t requiredSize = matrixCount * sizeof(glm::mat4) + sizeof(glm::mat4) * m_matricesPerUniformBuffer;
        if (m_modelUniform.GetSize() < requiredSize) {
            m_modelUniform.Resize(requiredSize + sizeof(glm::mat4) * m_matricesPerUniformBuffer);
        }
        // upload matrices
        m_modelUniform.Update(0, batchedMatrices.size() * sizeof(glm::mat4), batchedMatrices.data());

        // render
        m_meshProgram->Use();
        m_cameraUniform.Bind();
        uint32_t currentVao = 0;
        for (auto& batch : batches) {
            auto vao = batch.mesh->GetVAO();
            if (currentVao != vao) {
                glBindVertexArray(vao);
                currentVao = vao;
            }
            m_modelUniform.Bind(batch.instanceOffset * sizeof(glm::mat4), m_matricesPerUniformBuffer * sizeof(glm::mat4));
            glDrawArraysInstanced(GL_TRIANGLES, 0, batch.mesh->GetDrawCount(), batch.instanceCount);
        }
        // printf("draw calls: %zu, instances: %d, vertex count: %zu\n", batches.size(), matrixCount, matrixCount * mesh.GetDrawCount());
    }

    // post processing
    // m_postProcessingProgram->Use();
    // glDrawArrays(GL_TRIANGLES, 0, 3);
}

void Renderer::SetViewportSize(int32_t width, int32_t height) {
    if (m_viewportWidth == width && m_viewportHeight == height) return;
    m_viewportWidth = width;
    m_viewportHeight = height;
    glViewport(0, 0, width, height);
}
