#pragma once

#include <memory>
#include <entt/entt.hpp>

#include "PhysicsWorld.h"
#include "Camera.h"
#include "../util/Timer.h"
#include "../util/SceneBuilder.h"

class Scene {
public:
    Scene();
    virtual ~Scene();
    Scene(const Scene&) = delete;
    Scene& operator=(const Scene&) = delete;
    Scene(Scene&&) = delete;
    Scene& operator=(Scene&&) = delete;

    virtual void Update(TimeDuration dt) = 0;

    void SetCamera(const std::shared_ptr<Camera>& camera) { m_camera = camera; }
    const std::shared_ptr<Camera>& GetCamera() const { return m_camera; }

    const PhysicsWorld& GetPhysicsWorld() const { return m_physicsWorld; }

    entt::registry registry;
    glm::vec3 sunPosition{0, 100, 0};
protected:
    std::shared_ptr<Camera> m_camera;
    PhysicsWorld m_physicsWorld;
    SceneBuilder m_sceneBuilder;
private:
    void OnDestroyRigidBody(entt::registry& registry, entt::entity entity);
};