#pragma once

#include <entt/entt.hpp>
#include <vector>
#include <string>
#include <string_view>
#include <glm/glm.hpp>

#include "../core/PhysicsWorld.h"

class SceneBuilder {
public:
    SceneBuilder(entt::registry& registry, PhysicsWorld& physicsWorld);

    void AddModel(std::string_view name);
    void Update();
private:
    void Save();
    void CreateEntity();
    entt::registry& m_registry;
    PhysicsWorld& m_physicsWorld;
    struct State {
        entt::entity entity = entt::null;
        glm::vec3 position{0, 0, 0};
        glm::vec3 rotation{0, 0, 0};
        glm::vec3 scale{1, 1, 1};

        int selectedModel = -1;
        glm::vec3 modelOffset{0, 0, 0};
        glm::vec3 modelRotation{0, 0, 0};
        glm::vec3 modelScale{1, 1, 1};
        
        int selectedCollider = -1;
        glm::vec3 boxColliderSize{1, 1, 1};
    } m_state;
    std::vector<std::string> m_models;
    std::vector<std::string> m_colliders;
};