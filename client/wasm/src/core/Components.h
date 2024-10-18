#pragma once

#include <entt/entt.hpp>
#include <glm/glm.hpp>
#include <btBulletDynamicsCommon.h>

#include "../rendering/Mesh.h"

struct MeshComponent {
    Mesh mesh;
};

struct TransformComponent {
    glm::vec3 position;
    glm::vec3 rotation;
    glm::vec3 scale;
};

struct RigidBodyComponent {
    btRigidBody* body;
};