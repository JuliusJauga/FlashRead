#include "SceneBuilder.h"

#include <format>
#include <emscripten/fetch.h>
#include <sstream>

#include "../vendor/imgui/imgui.h"
#include "../vendor/imgui/imgui_stdlib.h"
#include "../core/Components.h"

SceneBuilder::SceneBuilder(entt::registry &registry, PhysicsWorld &physicsWorld)
    : m_registry(registry), m_physicsWorld(physicsWorld) {
    m_colliders.push_back("Box");
}

void SceneBuilder::AddModel(std::string_view name) {
    m_models.push_back(std::string(name));
}

void SceneBuilder::CreateEntity() {
    if (m_entity != entt::null) m_registry.destroy(m_entity);
    m_entity = m_registry.create();

    if (m_state.selectedModel != -1) {
        m_registry.emplace<MeshComponent>(m_entity, MeshComponent{
            .mesh = MeshRegistry::Get(m_models[m_state.selectedModel]),
            .position = m_state.modelOffset,
            .rotation = m_state.modelRotation,
            .scale = m_state.modelScale * (m_state.selectedCollider != -1 ? m_state.scale : glm::vec3{1})
        });
        if (m_state.selectedCollider == -1) {
            m_registry.emplace<TransformComponent>(m_entity, TransformComponent{
                .position = m_state.position,
                .rotation = m_state.rotation,
                .scale = m_state.scale
            });
        }
    }
    if (m_state.selectedCollider != -1) {
        auto col = m_physicsWorld.GetBoxCollider(m_state.boxColliderSize * m_state.scale);
        auto rb = m_physicsWorld.CreateRigidBody(col, 0, m_state.position, m_state.rotation);
        m_registry.emplace<RigidBodyComponent>(m_entity, RigidBodyComponent{rb});
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
            m_savedStates.push_back(m_state);
        }

        ImGui::InputText("##savename", &m_saveName);
        ImGui::SameLine();
        if (ImGui::Button("Save")) Save();
        ImGui::SameLine();
        if (ImGui::Button("Load")) Load();

        if (ImGui::Button("Reset")) Reset();
        CreateEntity();
    }
    ImGui::End();
}

void SceneBuilder::Reset() {
    m_savedStates.clear();
    m_state = State();
    m_entity = entt::null;
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
                char dummy;
                glm::vec3 v;
                stream >> dummy >> v.x >> dummy >> v.y >> dummy >> v.z >> dummy;
                return v;
            };
            
            // parse lines
            std::vector<State> states;
            std::string linestr;
            while (std::getline(stream, linestr)) {
                std::istringstream line(linestr);
                State state;

                // opening brace
                line.ignore(256, '{');
                line.ignore();

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
        if (saveable) m_savedStates.push_back(states[i]);
        m_state = states[i];
        CreateEntity();
        m_entity = entt::null;
    }
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
        for (const auto& state : m_savedStates) {
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