#pragma once

#include <entt/entt.hpp>
#include <vector>
#include <string>
#include <string_view>
#include <glm/glm.hpp>

class SceneBuilder {
public:
    SceneBuilder(entt::registry& registry);

    void AddModel(std::string_view name);
    void Update();
private:
    void Save();
    void CreateEntity();
    entt::registry& m_registry;
    struct State {
        entt::entity entity = entt::null;
        int selectedModel = -1;
        glm::vec3 position{0, 0, 0};
        glm::vec3 rotation{0, 0, 0};
        glm::vec3 scale{1, 1, 1};
    } m_state;
    std::vector<std::string> m_models;
};