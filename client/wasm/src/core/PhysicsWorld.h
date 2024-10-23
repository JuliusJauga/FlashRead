#pragma once

#include <memory>
#include <unordered_map>
#include <btBulletDynamicsCommon.h>
#include <glm/glm.hpp>
#include <glm/gtx/hash.hpp>

class PhysicsWorld {
public:
    PhysicsWorld();
    ~PhysicsWorld();

    std::shared_ptr<btCollisionShape> GetBoxCollider(const glm::vec3& halfExtents);
    std::shared_ptr<btCollisionShape> GetSphereCollider(float radius);
    std::shared_ptr<btCollisionShape> GetCapsuleCollider(float radius, float height);
    btRigidBody* CreateRigidBody(std::shared_ptr<btCollisionShape> colShape, float mass, const glm::vec3& position, const glm::vec3& rotation);

    // clears out any shapes that are no longer being used.
    // does not need to be called every frame. can be called every couple of seconds or so.
    void Update();

    std::unique_ptr<btDiscreteDynamicsWorld> dynamicsWorld;
private:
    void SetTransform(btTransform& transform, const glm::vec3& position, const glm::vec3& rotation);

    std::unique_ptr<btDefaultCollisionConfiguration> m_collisionConfiguration;
    std::unique_ptr<btCollisionDispatcher> m_dispatcher;
    std::unique_ptr<btBroadphaseInterface> m_broadphase;
    std::unique_ptr<btSequentialImpulseConstraintSolver> m_solver;

    std::unordered_map<glm::vec3, std::weak_ptr<btCollisionShape>> m_boxShapes;
    std::unordered_map<float, std::weak_ptr<btCollisionShape>> m_sphereShapes;
    std::unordered_map<glm::vec2, std::weak_ptr<btCollisionShape>> m_capsuleShapes;
};