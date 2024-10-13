#include "TestScene.h"

#include "../io/Input.h"
#include "../core/Components.h"

#include "../rendering/Mesh.h"
#include "../meshes/bunny.h"
#include "../meshes/teapot.h"

TestScene::TestScene() {
    SetCamera(m_player.GetCamera());

    Mesh mesh = MeshRegistry::Create("bunny");
    mesh->Load(bunny_vertexCount, reinterpret_cast<const Vertex*>(bunny_vertices));

    for (int i = 0; i < 20; i++) {
        for (int j = 0; j < 20; j++) {
            auto ent1 = registry.create();
            registry.emplace<MeshComponent>(ent1, MeshComponent{
                .mesh = mesh
            });
            registry.emplace<TransformComponent>(ent1, TransformComponent{
                .position = {i * 15, 0, j * 15},
                .rotation = {0, 60, 0},
                .scale = {40, 40, 40}
            });
        }
    }

    mesh = MeshRegistry::Create("teapot");
    mesh->Load(teapot_vertexCount, reinterpret_cast<const Vertex*>(teapot_vertices));
    for (int i = 0; i < 20; i++) {
        for (int j = 0; j < 20; j++) {
            auto ent1 = registry.create();
            registry.emplace<MeshComponent>(ent1, MeshComponent{
                .mesh = mesh
            });
            registry.emplace<TransformComponent>(ent1, TransformComponent{
                .position = {i * 15, 40, j * 15},
                .rotation = {45, 45, 45},
                .scale = {2, 1, 2}
            });
        }
    }
}

void TestScene::Update() {
    m_player.Update();
}