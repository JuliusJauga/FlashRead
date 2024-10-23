#include "SceneBuilder.h"

#include <format>
#include <emscripten/fetch.h>
#include <sstream>
#include <limits>

#include "../vendor/imgui/imgui.h"
#include "../vendor/imgui/imgui_stdlib.h"
#include "../core/Components.h"
#include "../rendering/Debug.h"

SceneBuilder::SceneBuilder(entt::registry &registry, PhysicsWorld &physicsWorld)
    : m_registry(registry), m_physicsWorld(physicsWorld) {
    m_colliders.push_back("Box");
}

void SceneBuilder::AddModel(std::string_view name) {
    m_models.push_back(std::string(name));
}

void SceneBuilder::Play() {
    m_playing = !m_playing;

    for (uint32_t i = 0; i < m_savedStates.size(); i++) {
        m_selectedEntity = i;
        RecreateEntity(m_playing);
    }
    m_selectedEntity = -1;
}

void SceneBuilder::RecreateEntity(bool useMass) {
    if (m_selectedEntity == -1) return;
    entt::entity& entity = m_savedStates[m_selectedEntity].first;
    State& state = m_savedStates[m_selectedEntity].second;
    if (entity != entt::null) m_registry.destroy(entity);
    entity = m_registry.create();

    if (state.selectedModel != -1) {
        m_registry.emplace<MeshComponent>(entity, MeshComponent{
            .mesh = MeshRegistry::Get(m_models[state.selectedModel]),
            .position = state.modelOffset,
            .rotation = state.modelRotation,
            .scale = state.modelScale * (state.selectedCollider != -1 ? state.scale : glm::vec3{1})
        });
        if (state.selectedCollider == -1) {
            m_registry.emplace<TransformComponent>(entity, TransformComponent{
                .position = state.position,
                .rotation = state.rotation,
                .scale = state.scale
            });
        }
    }
    if (state.selectedCollider != -1) {
        float mass = useMass ? state.mass : 0;
        auto col = m_physicsWorld.GetBoxCollider(state.boxColliderSize * state.scale);
        auto rb = m_physicsWorld.CreateRigidBody(col, mass, state.position, state.rotation);
        m_registry.emplace<RigidBodyComponent>(entity, RigidBodyComponent{rb});
    }
}

void SceneBuilder::Update() {
    // draw axis
    int32_t maxInt = 1000000;
    DebugDraw::DrawLine({-maxInt, 0, 0}, {maxInt, 0, 0}, {1, 0, 0});
    DebugDraw::DrawLine({0, -maxInt, 0}, {0, maxInt, 0}, {0, 1, 0});
    DebugDraw::DrawLine({0, 0, -maxInt}, {0, 0, maxInt}, {0, 0, 1});
    // draw floor
    for (int i = 0; i < 3000; i++) {
        int scale = i*2;
        DebugDraw::DrawLine({-maxInt, 0, scale}, {maxInt, 0, scale}, {0.5, 0.5, 0.5});
        DebugDraw::DrawLine({-maxInt, 0, -scale}, {maxInt, 0, -scale}, {0.5, 0.5, 0.5});
        DebugDraw::DrawLine({scale, 0, -maxInt}, {scale, 0, maxInt}, {0.5, 0.5, 0.5});
        DebugDraw::DrawLine({-scale, 0, -maxInt}, {-scale, 0, maxInt}, {0.5, 0.5, 0.5});
    }

    if (m_playing) return;

    // tool window
    if (ImGui::Begin("Scene Builder")) {
        if (ImGui::BeginListBox("Entities")) {
            for (int i = 0; i < m_savedStates.size(); i++) {
                ImGui::PushID(i);
                bool isSelected = i == m_selectedEntity;
                if (ImGui::Selectable(std::format("Entity {}", i).c_str(), isSelected)) {
                    if (isSelected) m_selectedEntity = -1;
                    else m_selectedEntity = i;
                }
                ImGui::PopID();
            }
            ImGui::EndListBox();
        }

        if (ImGui::Button("Create")) {
            m_savedStates.push_back({entt::null, State{}});
            m_selectedEntity = m_savedStates.size() - 1;
        }
        ImGui::SameLine();
        if (ImGui::Button("Delete")) {
            if (m_selectedEntity != -1) {
                m_registry.destroy(m_savedStates[m_selectedEntity].first);
                m_savedStates.erase(m_savedStates.begin() + m_selectedEntity);
                m_selectedEntity = -1;
            }
        }
        ImGui::SameLine();
        if (ImGui::Button("Clone")) {
            if (m_selectedEntity != -1) {
                auto stateCopy = m_savedStates[m_selectedEntity].second;
                m_selectedEntity++;
                m_savedStates.insert(m_savedStates.begin() + m_selectedEntity, {entt::null, stateCopy});
                RecreateEntity();
            }
        }

        if (m_selectedEntity != -1) {
            State& state = m_savedStates[m_selectedEntity].second;
            ImGui::DragFloat3("Position", &state.position.x, 0.1f);
            ImGui::DragFloat3("Rotation", &state.rotation.x, 0.5f);
            ImGui::DragFloat3("Scale", &state.scale.x, 0.1f);

            if (ImGui::BeginListBox("Models")) {
                for (int i = 0; i < m_models.size(); i++) {
                    ImGui::PushID(i);
                    bool isSelected = i == state.selectedModel;
                    if (ImGui::Selectable(m_models[i].c_str(), isSelected)) {
                        if (isSelected) state.selectedModel = -1;
                        else state.selectedModel = i;
                    }
                    ImGui::PopID();
                }
                ImGui::EndListBox();
            }
            if (state.selectedModel != -1) {
                ImGui::DragFloat3("Model offset", &state.modelOffset.x, 0.1f);
                ImGui::DragFloat3("Model Rotation", &state.modelRotation.x, 0.5f);
                ImGui::DragFloat3("Model Scale", &state.modelScale.x, 0.1f);
            }

            if (ImGui::BeginListBox("Colliders")) {
                for (int i = 0; i < m_colliders.size(); i++) {
                    ImGui::PushID(i);
                    bool isSelected = i == state.selectedCollider;
                    if (ImGui::Selectable(m_colliders[i].c_str(), isSelected)) {
                        if (isSelected) state.selectedCollider = -1;
                        else state.selectedCollider = i;
                    }
                    ImGui::PopID();
                }
                ImGui::EndListBox();
            }
            if (state.selectedCollider != -1) {
                ImGui::DragFloat("Mass (0 for static)", &state.mass, 0.025f);
                if (m_colliders[state.selectedCollider] == "Box") {
                    ImGui::DragFloat3("Box Collider Size", &state.boxColliderSize.x, 0.01f);
                }
            }

            state.rotation.x = fmod(state.rotation.x, 360);
            state.rotation.y = fmod(state.rotation.y, 360);
            state.rotation.z = fmod(state.rotation.z, 360);
            state.modelRotation.x = fmod(state.modelRotation.x, 360);
            state.modelRotation.y = fmod(state.modelRotation.y, 360);
            state.modelRotation.z = fmod(state.modelRotation.z, 360);
            RecreateEntity();
        }

        ImGui::InputText("##savename", &m_saveName);
        ImGui::SameLine();
        if (ImGui::Button("Save")) Save();
        ImGui::SameLine();
        if (ImGui::Button("Load")) Load();

        if (ImGui::Button("Reset")) Reset();
    }
    ImGui::End();
}

void SceneBuilder::Reset() {
    m_savedStates.clear();
    m_registry.clear();
}

void SceneBuilder::Load() {
#ifdef SHADER_HOT_RELOAD
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    attr.requestMethod[0] = 'G';
    attr.requestMethod[1] = 'E';
    attr.requestMethod[2] = 'T';
    attr.requestMethod[3] = 0;
    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
    attr.userData = this;

    attr.onsuccess = [](emscripten_fetch_t* fetch) {
        auto builder = static_cast<SceneBuilder*>(fetch->userData);
        if (fetch->status == 200) {
            // parse data
            std::string data(fetch->data, fetch->numBytes);
            // remove header/footer
            data = data.substr(data.find_first_of('{') + 1);
            data = data.substr(0, data.find_last_of('}'));
            std::istringstream stream(data);

            // helper func
            auto readvec3 = [](std::istringstream& stream) {
                glm::vec3 v;
                stream.ignore();
                stream >> v.x;
                stream.ignore();
                stream >> v.y;
                stream.ignore();
                stream >> v.z;
                stream.ignore();
                return v;
            };
            
            // parse lines
            std::vector<State> states;
            std::string linestr;
            while (std::getline(stream, linestr)) {
                if (linestr.length() < 15) continue;
                std::istringstream line(linestr);
                State state;

                // opening brace
                line.ignore(256, '{');

                // global stuff
                state.position = readvec3(line);
                line.ignore();
                state.rotation = readvec3(line);
                line.ignore();
                state.scale = readvec3(line);
                line.ignore();

                // model
                line >> state.selectedModel;
                line.ignore();
                state.modelOffset = readvec3(line);
                line.ignore();
                state.modelRotation = readvec3(line);
                line.ignore();
                state.modelScale = readvec3(line);
                line.ignore();

                // collider
                line >> state.selectedCollider;
                line.ignore();
                line >> state.mass;
                line.ignore();

                // box collider
                state.boxColliderSize = readvec3(line);

                states.push_back(state);
            }
            builder->Load(states.size(), states.data(), true);
        } else {
            printf("Failed to load scene: %s\n", fetch->url);
        }
        emscripten_fetch_close(fetch);
    };
    attr.onerror = [](emscripten_fetch_t* fetch) {
        printf("Failed to load scene: %s\n", fetch->url);
        emscripten_fetch_close(fetch);
    };
    emscripten_fetch(&attr, ("http://localhost:8000/scenes/" + std::string(m_saveName) + ".h").c_str());
#else
    printf("Loading from url only available in SHADER_HOT_RELOAD mode.\n");
#endif
}
void SceneBuilder::Load(uint32_t stateCount, const State *states, bool saveable) {
    Reset();
    for (uint32_t i = 0; i < stateCount; i++) {
        m_savedStates.push_back({entt::null, states[i]});
        m_selectedEntity = i;
        RecreateEntity(!saveable);
    }
    m_selectedEntity = -1;
    if (!saveable) m_savedStates.clear();
}
void SceneBuilder::Save() {
#ifdef SHADER_HOT_RELOAD
    // create save data
    std::string* saveDataIpl = new std::string("");
    std::string& saveData = *saveDataIpl;
    {
        auto vec3str = [](const glm::vec3& v) {
            return std::format("{{{},{},{}}}", v.x, v.y, v.z);
        };
        saveData += "#pragma once\n\n";
        saveData += "#include <stdint.h>\n";
        saveData += "#include \"../util/SceneBuilder.h\"\n\n";
        saveData += std::format("constexpr uint32_t {}_stateVersion = {};\n", m_saveName, m_stateVersion);
        saveData += std::format("constexpr uint32_t {}_stateCount = {};\n", m_saveName, m_savedStates.size());
        saveData += std::format("constexpr SceneBuilder::State {}_states[] = {{\n", m_saveName);
        for (const auto& pair : m_savedStates) {
            const State& state = pair.second;
            saveData += std::format("   {{{},{},{},", vec3str(state.position), vec3str(state.rotation), vec3str(state.scale));
            saveData += std::format("{},{},{},{},", state.selectedModel, vec3str(state.modelOffset), vec3str(state.modelRotation), vec3str(state.modelScale));
            saveData += std::format("{},{},{}}},\n", state.selectedCollider, state.mass, vec3str(state.boxColliderSize));
        }
        saveData += "};\n";
    }

    // save to file
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    const char* headers[] = {
        "Content-Type", "text/plain", 0
    };
    attr.requestHeaders = headers;
    attr.requestMethod[0] = 'P';
    attr.requestMethod[1] = 'O';
    attr.requestMethod[2] = 'S';
    attr.requestMethod[3] = 'T';
    attr.requestMethod[4] = 0;
    attr.requestData = saveData.c_str();
    attr.requestDataSize = saveData.size();
    attr.userData = saveDataIpl;

    auto finishSequence = [](emscripten_fetch_t* fetch) {
        auto saveDataIpl = static_cast<std::string*>(fetch->userData);
        delete saveDataIpl;
        emscripten_fetch_close(fetch);
    };

    attr.onsuccess = finishSequence;
    attr.onerror = finishSequence;

    emscripten_fetch(&attr, ("http://localhost:8000/SaveScene/" + m_saveName).c_str());
#else
    printf("Saving only available in SHADER_HOT_RELOAD mode.\n");
#endif
}