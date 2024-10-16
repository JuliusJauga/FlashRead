#include "TestScene.h"

#include "../io/Input.h"
#include "../core/Components.h"
#include "../rendering/Mesh.h"

#include "../meshes/bunny.h"
#include "../meshes/teapot.h"
#include "../meshes/sponza.h"
#include "../meshes/bookshelf.h"

TestScene::TestScene() {
    SetCamera(m_player.GetCamera());
    sunPosition = glm::vec3{1000, 3500, 800} * 1000.f;

    Mesh mesh = MeshRegistry::Create("sponza");
    mesh->Load(sponza_vertexCount, reinterpret_cast<const Vertex*>(sponza_vertices));

    auto sponza = registry.create();
    registry.emplace<MeshComponent>(sponza, MeshComponent{
        .mesh = mesh
    });

    // for (int i = 0; i < 5; i++) {
    //     for (int j = 0; j < 5; j++) {
    //         auto ent1 = registry.create();
    //         registry.emplace<MeshComponent>(ent1, MeshComponent{
    //             .mesh = mesh
    //         });
    //         registry.emplace<TransformComponent>(ent1, TransformComponent{
    //             .position = {i * 50, 0, j * 50},
    //             .rotation = {0, 0, 0},
    //             .scale = {100, 100, 100}
    //         });
    //     }
    // }

}

void TestScene::Update() {
    m_player.Update();
}