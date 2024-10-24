#pragma once

#include <memory>
#include "../core/Camera.h"
#include "../core/PhysicsWorld.h"
#include "../util/Timer.h"

class Player {
public:
    Player(PhysicsWorld& physicsWorld, const glm::vec3& position);
    ~Player();
    Player(const Player&) = delete;
    Player& operator=(const Player&) = delete;
    Player(Player&& other) noexcept;
    Player& operator=(Player&& other) noexcept;

    void Update(float dt);
    void UpdateCameraAfterPhysics();
    
    void SetCamera(const std::shared_ptr<Camera>& camera) { m_camera = camera; }
    const std::shared_ptr<Camera>& GetCamera() const { return m_camera; }

    float mouseSensitivity = 0.5f;
    float moveSpeed = 0.05f;
    bool fly = false;
private:
    void Cleanup();
    void UpdateInput(float dt);
    std::reference_wrapper<PhysicsWorld> m_physicsWorld;
    btRigidBody* m_rigidBody;
    std::shared_ptr<Camera> m_camera;
    TimePoint m_lastJump;
};