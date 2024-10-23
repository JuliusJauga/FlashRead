#pragma once

#include <entt/entt.hpp>
#include <vector>
#include <string>
#include <string_view>
#include <glm/glm.hpp>
#include <stdint.h>

#include "../core/PhysicsWorld.h"

class SceneBuilder {
public:
    SceneBuilder(entt::registry& registry, PhysicsWorld& physicsWorld);

    void AddModel(std::string_view name);
    void Update();

    struct State {
        glm::vec3 position{0, 0, 0};
        glm::vec3 rotation{0, 0, 0};
        glm::vec3 scale{1, 1, 1};

        int selectedModel = -1;
        glm::vec3 modelOffset{0, 0, 0};
        glm::vec3 modelRotation{0, 0, 0};
        glm::vec3 modelScale{1, 1, 1};
        
        int selectedCollider = -1;
        float mass = 0;
        glm::vec3 boxColliderSize{1, 1, 1};
    };
    void Load(uint32_t stateCount, const State* states, bool saveable = false);

private:
    void Load();
    void Save();
    void Reset();
    void CreateEntity();
    entt::registry& m_registry;
    PhysicsWorld& m_physicsWorld;
    entt::entity m_entity = entt::null;
    std::string m_saveName;
    State m_state;
    uint32_t m_stateVersion = 0;
    std::vector<std::string> m_models;
    std::vector<std::string> m_colliders;

    std::vector<State> m_savedStates;
};