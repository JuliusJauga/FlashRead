#pragma once

#include <entt/entt.hpp>
#include <glm/glm.hpp>
#include <btBulletDynamicsCommon.h>

#include "../rendering/Mesh.h"

struct MeshComponent {
    Mesh mesh;
    glm::vec3 position;
    glm::vec3 rotation;
    glm::vec3 scale{1};
};

struct TransformComponent {
    glm::vec3 position;
    glm::vec3 rotation;
    glm::vec3 scale{1};
};

struct RigidBodyComponent {
    btRigidBody* body;
};