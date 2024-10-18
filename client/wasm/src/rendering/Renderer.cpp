#include "Renderer.h"

#include <unordered_map>
#include <vector>
#include <glm/gtc/matrix_transform.hpp>
#include <emscripten/fetch.h>
#include <glm/gtc/type_ptr.hpp>

#include "../vendor/imgui/imgui.h"
#include "../vendor/imgui/imgui_impl_sdl2.h"
#include "../vendor/imgui/imgui_impl_opengl3.h"
#include "../core/Components.h"
#include "Debug.h"

Renderer::Renderer()
    : m_viewportWidth{1}, m_viewportHeight{1}, m_gbuffer(m_viewportWidth, m_viewportHeight) {
    ReloadShaders();

    // GL settings
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);

    glEnable(GL_DEPTH_TEST);
    glDepthFunc(GL_LESS);

    glClearColor(0.5f, 0.4f, 0.3f, 1.0f);
}
Renderer::~Renderer() {}

void Renderer::LoadShaderFromFile(std::string file) {
    if (file.empty()) {
        for (int i = m_shaderLoadingPrograms.size(); i > 0; i--) {
            auto vert = m_shaderLoadingOutput.front(); m_shaderLoadingOutput.pop_front();
            auto frag = m_shaderLoadingOutput.front(); m_shaderLoadingOutput.pop_front();
            auto prog = m_shaderLoadingPrograms.front(); m_shaderLoadingPrograms.pop_front();
            *prog = std::make_unique<ShaderProgram>(vert.c_str(), frag.c_str());
        }
        SetupUniforms();
        return;
    }

    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    attr.requestMethod[0] = 'G';
    attr.requestMethod[1] = 'E';
    attr.requestMethod[2] = 'T';
    attr.requestMethod[3] = 0;
    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
    attr.userData = this;

    attr.onsuccess = [](emscripten_fetch_t* fetch) {
        auto renderer = static_cast<Renderer*>(fetch->userData);
        if (fetch->status == 200) {
            // save output
            renderer->m_shaderLoadingOutput.push_back(std::string(fetch->data + 3, fetch->numBytes - 5));
        } else {
            printf("Failed to load shader: %s\n", fetch->url);
        }
        emscripten_fetch_close(fetch);
        if (renderer->m_shaderLoadingQueue.empty()) { // compile shaders
            renderer->LoadShaderFromFile("");
        } else { // load next
            std::string next = renderer->m_shaderLoadingQueue.front();
            renderer->m_shaderLoadingQueue.pop_front();
            renderer->LoadShaderFromFile(next);
        }
    };
    attr.onerror = [](emscripten_fetch_t* fetch) {
        printf("Failed to load shader: %s\n", fetch->url);
        emscripten_fetch_close(fetch);
    };
    emscripten_fetch(&attr, ("http://localhost:8000/" + std::string(file)).c_str());
}

void Renderer::ReloadShaders() {
    m_shadersLoading = true;
    printf("Loading shaders ...\n");
    // mesh
    {
        #ifdef SHADER_HOT_RELOAD
            m_shaderLoadingPrograms.push_back(&m_meshProgram);
            m_shaderLoadingQueue.push_back("shaders/mesh.vs");
            m_shaderLoadingQueue.push_back("shaders/mesh.fs");
        #else        
            const GLchar vertexSource[] = {
                #include "shaders/mesh.vs"
            };
            const GLchar fragmentSource[] = {
                #include "shaders/mesh.fs"
            };
            m_meshProgram = std::make_unique<ShaderProgram>(vertexSource, fragmentSource);
        #endif
    }
    // lighting
    {
        #ifdef SHADER_HOT_RELOAD
            m_shaderLoadingPrograms.push_back(&m_lightingProgram);
            m_shaderLoadingQueue.push_back("shaders/light.vs");
            m_shaderLoadingQueue.push_back("shaders/light.fs");
        #else        
            const GLchar vertexSource[] = {
                #include "shaders/light.vs"
            };
            const GLchar fragmentSource[] = {
                #include "shaders/light.fs"
            };
            m_lightingProgram = std::make_unique<ShaderProgram>(vertexSource, fragmentSource);
        #endif
    }
    // debug
    {
        #ifdef SHADER_HOT_RELOAD
            m_shaderLoadingPrograms.push_back(&m_debugProgram);
            m_shaderLoadingQueue.push_back("shaders/debug.vs");
            m_shaderLoadingQueue.push_back("shaders/debug.fs");
        #else        
            const GLchar vertexSource[] = {
                #include "shaders/debug.vs"
            };
            const GLchar fragmentSource[] = {
                #include "shaders/debug.fs"
            };
            m_debugProgram = std::make_unique<ShaderProgram>(vertexSource, fragmentSource);
        #endif
    }

    #ifdef SHADER_HOT_RELOAD
        std::string shaderFileToLoad = m_shaderLoadingQueue.front(); m_shaderLoadingQueue.pop_front();
        LoadShaderFromFile(shaderFileToLoad);
    #else
        SetupUniforms();
    #endif
}

void Renderer::SetupUniforms() {
    // setup uniforms
    m_nextUniformBindingIndex = 0;

    m_cameraUniform.SetBindingIndex(GetNextUniformBindingIndex());
    m_meshProgram->AddUniformBufferBinding("Camera", m_cameraUniform.GetBindingIndex());
    m_debugProgram->AddUniformBufferBinding("Camera", m_cameraUniform.GetBindingIndex());
    m_cameraUniform.Bind();

    m_modelUniform.SetBindingIndex(GetNextUniformBindingIndex());
    m_meshProgram->AddUniformBufferBinding("ModelMatrices", m_modelUniform.GetBindingIndex());

    m_lightingInfoUniform.SetBindingIndex(GetNextUniformBindingIndex());
    m_lightingProgram->AddUniformBufferBinding("LightingInfo", m_lightingInfoUniform.GetBindingIndex());
    m_lightingInfoUniform.Bind();

    m_shadersLoading = false;
    printf("Shaders loaded.\n");
}

void Renderer::Render(const std::shared_ptr<Scene> &scene) {
    ImGui::Render();
    if (m_shadersLoading) return;

    // update uniforms
    auto& camera = scene->GetCamera();
    camera->Update(m_viewportWidth, m_viewportHeight);
    m_cameraUniform.Update({
        .projxview = camera->GetProjectionMatrix() * camera->GetViewMatrix(),
        .nearFarPlane = {camera->GetNearPlane(), camera->GetFarPlane()}
    });
    m_lightingInfoUniform.Update({
        .lightPos = scene->sunPosition,
        .cameraPos = camera->position,
        .viewportSize = glm::vec2(m_viewportWidth, m_viewportHeight)
    });

    // render entities
    glBindFramebuffer(GL_FRAMEBUFFER, m_gbuffer.GetFBO());
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    {
        // get renderable meshes and matrices
        uint32_t matrixCount = 0;
        std::unordered_map<Mesh, std::vector<glm::mat4>> meshMatrices;
        for (auto&& [entity, meshComp, transformComp] : scene->registry.view<MeshComponent, TransformComponent>().each()) {
            // get model matrix
            glm::mat4 model{1};
            model = glm::translate(model, transformComp.position);
            model = glm::scale(model, transformComp.scale);
            model = glm::rotate(model, transformComp.rotation.x, glm::vec3(1, 0, 0));
            model = glm::rotate(model, transformComp.rotation.y, glm::vec3(0, 1, 0));
            model = glm::rotate(model, transformComp.rotation.z, glm::vec3(0, 0, 1));

            // add to map
            meshMatrices[meshComp.mesh].push_back(model);
            matrixCount++;
        }
        for (auto&& [entity, meshComp, rbComp] : scene->registry.view<MeshComponent, RigidBodyComponent>().each()) {
            auto body = rbComp.body;
            // get model matrix
            btTransform transform;
            if (body && body->getMotionState()) body->getMotionState()->getWorldTransform(transform);
            else transform = body->getWorldTransform();
            
            glm::mat4 model{1};
            transform.getOpenGLMatrix(glm::value_ptr(model));

            // add to map
            meshMatrices[meshComp.mesh].push_back(model);
            matrixCount++;
        }

        // batch matrices and get render data
        std::vector<glm::mat4> batchedMatrices; // TODO: possible to avoid copying matrices into this single vector, but more complex
        batchedMatrices.reserve(matrixCount);
        std::vector<MeshModelUniform> batches;
        uint32_t currentUboOffset = 0;
        uint32_t currentBatchSize = 0;
        for (auto& [mesh, models] : meshMatrices) {
            batchedMatrices.insert(batchedMatrices.end(), models.begin(), models.end());
            uint32_t matricesLeft = models.size();
            while (matricesLeft > 0) {
                const uint32_t matricesInThisBatch = std::min(matricesLeft, m_matricesPerUniformBuffer - currentBatchSize);
                matricesLeft -= matricesInThisBatch;
                currentBatchSize = (currentBatchSize + matricesInThisBatch) % m_matricesPerUniformBuffer;

                MeshModelUniform batchData;
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
    }
    // debug
    if (DebugDraw::IsEnabled()) {
        m_debugProgram->Use();
        scene->GetPhysicsWorld().dynamicsWorld->setDebugDrawer(DebugDraw::GetDrawer());
        scene->GetPhysicsWorld().dynamicsWorld->debugDrawWorld();
        DebugDraw::Draw();
    }

    // lighting (final)
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
    m_lightingProgram->Use();
    m_lightingProgram->SetTexture("tPosition", 0, m_gbuffer.GetPositionTexture());
    m_lightingProgram->SetTexture("tColor", 1, m_gbuffer.GetColorTexture());
    m_lightingProgram->SetTexture("tNormal", 2, m_gbuffer.GetNormalTexture());
    glDrawArrays(GL_TRIANGLES, 0, 3);

    // imgui
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
}

void Renderer::SetViewportSize(int32_t width, int32_t height) {
    if (m_viewportWidth == width && m_viewportHeight == height) return;
    m_viewportWidth = width;
    m_viewportHeight = height;
    glViewport(0, 0, width, height);
    m_gbuffer.Resize(width, height);
}
