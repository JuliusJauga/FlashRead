#pragma once

#include "../core/Scene.h"
#include "Player.h"

class TestScene : public Scene {
public:
    TestScene();
    ~TestScene() = default;

    void Update() override;

private:
    Player m_player;
};