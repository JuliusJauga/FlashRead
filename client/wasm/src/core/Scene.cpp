#include "Scene.h"

#include "Components.h"

Scene::Scene()
    : m_sceneBuilder(registry, m_physicsWorld) {
    registry.on_destroy<RigidBodyComponent>().connect<&Scene::OnDestroyRigidBody>(*this);
}

void Scene::OnDestroyRigidBody(entt::registry& registry, entt::entity entity) {
    auto body = registry.get<RigidBodyComponent>(entity).body;
    m_physicsWorld.dynamicsWorld->removeRigidBody(body);
    if (body && body->getMotionState()) {
        delete body->getMotionState();
    }
    auto ptr = static_cast<std::shared_ptr<btCollisionShape>*>(body->getUserPointer());
    delete ptr;
    delete body;
}

Scene::~Scene() {
    registry.clear();
}