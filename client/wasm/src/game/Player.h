#pragma once

#include <memory>
#include "../core/Camera.h"

class Player {
public:
    Player();
    ~Player() = default;

    void Update();
    
    void SetCamera(const std::shared_ptr<Camera>& camera) { m_camera = camera; }
    const std::shared_ptr<Camera>& GetCamera() const { return m_camera; }

    float mouseSensitivity = 0.5f;
    float moveSpeed = 0.2f;

private:
    void UpdateInput();

    std::shared_ptr<Camera> m_camera;
};