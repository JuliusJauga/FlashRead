#include "SceneBuilder.h"

#include "../vendor/imgui/imgui.h"
#include "../core/Components.h"

SceneBuilder::SceneBuilder(entt::registry &registry, PhysicsWorld &physicsWorld)
    : m_registry(registry), m_physicsWorld(physicsWorld) {
    m_colliders.push_back("Box");
}

void SceneBuilder::AddModel(std::string_view name) {
    m_models.push_back(std::string(name));
}

void SceneBuilder::Save() {

}

void SceneBuilder::CreateEntity() {
    if (m_state.entity != entt::null) m_registry.destroy(m_state.entity);
    m_state.entity = m_registry.create();

    if (m_state.selectedModel != -1) {
        m_registry.emplace<MeshComponent>(m_state.entity, MeshComponent{
            .mesh = MeshRegistry::Get(m_models[m_state.selectedModel]),
            .position = m_state.modelOffset,
            .rotation = m_state.modelRotation,
            .scale = m_state.modelScale * (m_state.selectedCollider == -1 ? m_state.scale : glm::vec3{1})
        });
        if (m_state.selectedCollider == -1) {
            m_registry.emplace<TransformComponent>(m_state.entity, TransformComponent{
                .position = m_state.position,
                .rotation = m_state.rotation,
                .scale = m_state.scale
            });
        }
    }
    if (m_state.selectedCollider != -1) {
        auto col = m_physicsWorld.GetBoxCollider(m_state.boxColliderSize * m_state.scale);
        auto rb = m_physicsWorld.CreateRigidBody(col, 0, m_state.position, m_state.rotation);
        m_registry.emplace<RigidBodyComponent>(m_state.entity, RigidBodyComponent{rb});
    }
}

void SceneBuilder::Update() {
    if (ImGui::Begin("Scene Builder")) {
        ImGui::DragFloat3("Position", &m_state.position.x, 0.1f);
        ImGui::DragFloat3("Rotation", &m_state.rotation.x, 0.5f);
        ImGui::DragFloat3("Scale", &m_state.scale.x, 0.1f);
        
        if (ImGui::BeginListBox("Models")) {
            for (int i = 0; i < m_models.size(); i++) {
                ImGui::PushID(i);
                bool isSelected = i == m_state.selectedModel;
                if (ImGui::Selectable(m_models[i].c_str(), isSelected)) {
                    if (isSelected) m_state.selectedModel = -1;
                    else m_state.selectedModel = i;
                }
                ImGui::PopID();
            }
            ImGui::EndListBox();
        }
        if (m_state.selectedModel != -1) {
            ImGui::DragFloat3("Model offset", &m_state.modelOffset.x, 0.1f);
            ImGui::DragFloat3("Model Rotation", &m_state.modelRotation.x, 0.5f);
            ImGui::DragFloat3("Model Scale", &m_state.modelScale.x, 0.1f);
        }

        if (ImGui::BeginListBox("Colliders")) {
            for (int i = 0; i < m_colliders.size(); i++) {
                ImGui::PushID(i);
                bool isSelected = i == m_state.selectedCollider;
                if (ImGui::Selectable(m_colliders[i].c_str(), isSelected)) {
                    if (isSelected) m_state.selectedCollider = -1;
                    else m_state.selectedCollider = i;
                }
                ImGui::PopID();
            }
            ImGui::EndListBox();
        }
        if (m_state.selectedCollider != -1) {
            if (m_colliders[m_state.selectedCollider] == "Box") {
                ImGui::DragFloat3("Box Collider Size", &m_state.boxColliderSize.x, 0.01f);
            }
        }

        m_state.rotation.x = fmod(m_state.rotation.x, 360);
        m_state.rotation.y = fmod(m_state.rotation.y, 360);
        m_state.rotation.z = fmod(m_state.rotation.z, 360);
        m_state.modelRotation.x = fmod(m_state.modelRotation.x, 360);
        m_state.modelRotation.y = fmod(m_state.modelRotation.y, 360);
        m_state.modelRotation.z = fmod(m_state.modelRotation.z, 360);


        if (ImGui::Button("Create")) {
            CreateEntity();
            m_state.entity = entt::null;
        }

        if (ImGui::Button("Save")) Save();
        if (ImGui::Button("Reset")) m_state = State(); 
        CreateEntity();
    }
    ImGui::End();
}