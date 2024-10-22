#include "TestScene.h"

#include "../io/Input.h"
#include "../core/Components.h"
#include "../rendering/Mesh.h"

#include "../meshes/bunny.h"
#include "../meshes/teapot.h"
#include "../meshes/sponza.h"
#include "../meshes/bookshelf.h"
#include "../meshes/table.h"

#include "../scenes/testscene.h" 

TestScene::TestScene() {
    SetCamera(m_player.GetCamera());
    sunPosition = glm::vec3{1000, 3500, 800} * 1000.f;

    Mesh mesh = MeshRegistry::Create("bunny");
    mesh->Load(bunny_vertexCount, reinterpret_cast<const Vertex*>(bunny_vertices), glm::scale(glm::mat4(1), glm::vec3(50)));
    mesh = MeshRegistry::Create("sponza");
    mesh->Load(sponza_vertexCount, reinterpret_cast<const Vertex*>(sponza_vertices));
    mesh = MeshRegistry::Create("teapot");
    mesh->Load(teapot_vertexCount, reinterpret_cast<const Vertex*>(teapot_vertices));
    mesh = MeshRegistry::Create("bookshelf");
    mesh->Load(bookshelf_vertexCount, reinterpret_cast<const Vertex*>(bookshelf_vertices));
    mesh = MeshRegistry::Create("table");
    mesh->Load(table_vertexCount, reinterpret_cast<const Vertex*>(table_vertices));

    m_sceneBuilder.AddModel("bunny");
    m_sceneBuilder.AddModel("sponza");
    m_sceneBuilder.AddModel("teapot");
    m_sceneBuilder.AddModel("bookshelf");
    m_sceneBuilder.AddModel("table");

#ifndef SHADER_HOT_RELOAD
    m_sceneBuilder.Load(testscene_stateCount, testscene_states);
#endif

    mesh = MeshRegistry::Get("sponza");
    auto sponza = registry.create();
    registry.emplace<MeshComponent>(sponza, MeshComponent{mesh});
    registry.emplace<TransformComponent>(sponza, TransformComponent{
        .position = {2000, 2000, 0},
        .rotation = {0, 0, 0},
        .scale = {1, 1, 1}
    });

    // create entity
    {
        auto floor = registry.create();
        // attach rigid body
        const auto& boxCol = m_physicsWorld.GetBoxCollider({1000, 1, 1000});
        auto rb = m_physicsWorld.CreateRigidBody(boxCol, 0, {0, -100, 0}, {0, 0, 0});
        registry.emplace<RigidBodyComponent>(floor, RigidBodyComponent{rb});
    }
}

void TestScene::Update(TimeDuration dt) {
    m_sceneBuilder.Update();
    
    m_player.Update();
    auto& dynamicsWorld = m_physicsWorld.dynamicsWorld;
    dynamicsWorld->stepSimulation(dt.fMilli(), 1);

    // create entity
    if (Input::IsHeld(SDL_SCANCODE_B)) {
        auto rabbit = registry.create();
        // attach mesh
        Mesh mesh = MeshRegistry::Get("bunny");
        registry.emplace<MeshComponent>(rabbit, MeshComponent{mesh});
        // attach rigid body
        const auto& boxCol = m_physicsWorld.GetBoxCollider({2, 2, 2});
        auto rb = m_physicsWorld.CreateRigidBody(boxCol, 10.f, {0, 1000, 0}, {0, 0, 0});
        registry.emplace<RigidBodyComponent>(rabbit, RigidBodyComponent{rb});
    }
}