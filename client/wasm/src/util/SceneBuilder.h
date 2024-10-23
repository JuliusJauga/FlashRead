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
    void Play();
    bool IsPlaying() { return m_playing; }

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
        float sphereColliderRadius = 1;
        float capsuleColliderRadius = 1;
        float capsuleColliderHeight = 1;
    };
    void Load(uint32_t stateCount, const State* states, bool saveable = false);

private:
    void Load();
    void Save();
    void Reset();
    void RecreateEntity(bool useMass = false);
    bool m_playing = false;
    entt::registry& m_registry;
    PhysicsWorld& m_physicsWorld;
    uint32_t m_selectedEntity = -1;
    std::string m_saveName;
    uint32_t m_stateVersion = 1;
    std::vector<std::string> m_models;
    std::vector<std::string> m_colliders;

    std::vector<std::pair<entt::entity, State>> m_savedStates;
};