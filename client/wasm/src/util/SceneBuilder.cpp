#include "SceneBuilder.h"

#include "../vendor/imgui/imgui.h"
#include "../core/Components.h"

SceneBuilder::SceneBuilder(entt::registry &registry)
    : m_registry(registry) {

}

void SceneBuilder::AddModel(std::string_view name) {
    m_models.push_back(std::string(name));
}

void SceneBuilder::Save() {

}

void SceneBuilder::CreateEntity() {
    if (m_state.entity != entt::null) m_registry.destroy(m_state.entity);
    m_state.entity = m_registry.create();
    m_registry.emplace<MeshComponent>(m_state.entity, MeshComponent{MeshRegistry::Get(m_models[m_state.selectedModel])});
    m_registry.emplace<TransformComponent>(m_state.entity, TransformComponent{
        .position = m_state.position,
        .rotation = m_state.rotation,
        .scale = m_state.scale
    });
}

void SceneBuilder::Update() {
    if (ImGui::Begin("Scene Builder")) {
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
            ImGui::DragFloat3("Position", &m_state.position.x, 0.1f);
            ImGui::DragFloat3("Rotation", &m_state.rotation.x, 0.1f);
            ImGui::DragFloat3("Scale", &m_state.scale.x, 0.1f);
            if (ImGui::Button("Create")) {
                CreateEntity();
                m_state.entity = entt::null;
            }
        }
        if (ImGui::Button("Save")) Save();
        CreateEntity();
        ImGui::End();
    }
}