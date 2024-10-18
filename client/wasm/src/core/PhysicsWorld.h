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
    btRigidBody* CreateRigidBody(std::shared_ptr<btCollisionShape> colShape, float mass, const glm::vec3& position, const glm::vec3& rotation);

    // does not need to be called every frame. can be called every couple of seconds or so
    void Update();

    std::unique_ptr<btDiscreteDynamicsWorld> dynamicsWorld;
private:
    void SetTransform(btTransform& transform, const glm::vec3& position, const glm::vec3& rotation);

    std::unique_ptr<btDefaultCollisionConfiguration> m_collisionConfiguration;
    std::unique_ptr<btCollisionDispatcher> m_dispatcher;
    std::unique_ptr<btBroadphaseInterface> m_broadphase;
    std::unique_ptr<btSequentialImpulseConstraintSolver> m_solver;

    std::unordered_map<glm::vec3, std::weak_ptr<btCollisionShape>> m_boxShapes;
};