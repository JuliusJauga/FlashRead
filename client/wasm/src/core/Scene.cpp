#include "Scene.h"

#include "Components.h"

Scene::Scene()
    : m_sceneBuilder(registry, m_physicsWorld) {
    registry.on_destroy<RigidBodyComponent>().connect<&Scene::OnDestroyRigidBody>(*this);
}

void Scene::OnDestroyRigidBody(entt::registry& registry, entt::entity entity) {
    auto body = registry.get<RigidBodyComponent>(entity).body;
    m_physicsWorld.DestroyRigidBody(body);
}

Scene::~Scene() {
    registry.clear();
}