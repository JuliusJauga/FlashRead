#include "TestScene.h"

#include "../io/Input.h"
#include "../core/Components.h"
#include "../rendering/Mesh.h"

#include "../meshes/candle.h"
#include "../meshes/chair.h"
#include "../meshes/closedBook.h"
#include "../meshes/emptyBookshelf.h"
#include "../meshes/fullBookshelf.h"
#include "../meshes/lectern.h"
#include "../meshes/openBook.h"
#include "../meshes/pencil.h"
#include "../meshes/table.h"


TestScene::TestScene() {
    SetCamera(m_player.GetCamera());
    sunPosition = glm::vec3{1000, 3500, 800} * 1000.f;

    
    Mesh mesh = MeshRegistry::Create("table");
    mesh->Load(table_vertexCount, reinterpret_cast<const Vertex*>(table_vertices));
    mesh = MeshRegistry::Create("candle");
    mesh->Load(candle_vertexCount, reinterpret_cast<const Vertex*>(candle_vertices));
    mesh = MeshRegistry::Create("chair");
    mesh->Load(chair_vertexCount, reinterpret_cast<const Vertex*>(chair_vertices));
    mesh = MeshRegistry::Create("closedBook");
    mesh->Load(closedBook_vertexCount, reinterpret_cast<const Vertex*>(closedBook_vertices));
    mesh = MeshRegistry::Create("emptyBookshelf");
    mesh->Load(emptyBookshelf_vertexCount, reinterpret_cast<const Vertex*>(emptyBookshelf_vertices));
    mesh = MeshRegistry::Create("fullBookshelf");
    mesh->Load(fullBookshelf_vertexCount, reinterpret_cast<const Vertex*>(fullBookshelf_vertices));
    mesh = MeshRegistry::Create("lectern");
    mesh->Load(lectern_vertexCount, reinterpret_cast<const Vertex*>(lectern_vertices));
    mesh = MeshRegistry::Create("openBook");
    mesh->Load(openBook_vertexCount, reinterpret_cast<const Vertex*>(openBook_vertices));
    mesh = MeshRegistry::Create("pencil");
    mesh->Load(pencil_vertexCount, reinterpret_cast<const Vertex*>(pencil_vertices));

    m_sceneBuilder.AddModel("candle");
    m_sceneBuilder.AddModel("chair");
    m_sceneBuilder.AddModel("closedBook");
    m_sceneBuilder.AddModel("emptyBookshelf");
    m_sceneBuilder.AddModel("fullBookshelf");
    m_sceneBuilder.AddModel("lectern");
    m_sceneBuilder.AddModel("openBook");
    m_sceneBuilder.AddModel("pencil");
    m_sceneBuilder.AddModel("table");

// #ifndef SHADER_HOT_RELOAD
//     m_sceneBuilder.Load(testscene_stateCount, testscene_states);
// #endif

}

void TestScene::Update(TimeDuration dt) {
    // scene builder
    m_sceneBuilder.Update();
    if (Input::JustPressed(SDL_SCANCODE_L)) {
        m_sceneBuilder.Play();
    }
    
    // logic
    static btRigidBody* playerRigidBody = m_physicsWorld.CreateRigidBody(m_physicsWorld.GetCapsuleCollider(1, 2), 1.f, {0, 0, 0}, {0, 0, 0});
    m_player.Update(m_sceneBuilder.IsPlaying() ? playerRigidBody : nullptr, dt.fMilli());

    // physics
    static TimePoint lastPhysicsUpdate; TimePoint now;
    if (now - lastPhysicsUpdate > 1s) {
        m_physicsWorld.Update();
        lastPhysicsUpdate = now;
    }
    auto& dynamicsWorld = m_physicsWorld.dynamicsWorld;
    dynamicsWorld->stepSimulation(dt.fMilli(), 1);

    // camera
    if (m_sceneBuilder.IsPlaying()) {
        auto body = playerRigidBody;
        btTransform transform;
        if (body && body->getMotionState()) body->getMotionState()->getWorldTransform(transform);
        else transform = body->getWorldTransform();

        m_camera->position = {transform.getOrigin().x(), transform.getOrigin().y() + 0.5f, transform.getOrigin().z()};
    }

    // random stuff
    // create entity
    if (Input::IsHeld(SDL_SCANCODE_B)) {
        auto rabbit = registry.create();
        // attach mesh
        Mesh mesh = MeshRegistry::Get("candle");
        registry.emplace<MeshComponent>(rabbit, MeshComponent{mesh});
        // attach rigid body
        const auto& boxCol = m_physicsWorld.GetBoxCollider({2, 2, 2});
        auto rb = m_physicsWorld.CreateRigidBody(boxCol, 10.f, {0, 1000, 0}, {0, 0, 0});
        registry.emplace<RigidBodyComponent>(rabbit, RigidBodyComponent{rb});
    }
}