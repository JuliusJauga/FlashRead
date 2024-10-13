#pragma once

#include <memory>

#include "Camera.h"
#include <entt/entt.hpp>

class Scene {
public:
    Scene() = default;
    virtual ~Scene() = 0;
    Scene(const Scene&) = delete;
    Scene& operator=(const Scene&) = delete;
    Scene(Scene&&) = delete;
    Scene& operator=(Scene&&) = delete;

    virtual void Update() = 0;

    void SetCamera(const std::shared_ptr<Camera>& camera) { m_camera = camera; }
    const std::shared_ptr<Camera>& GetCamera() const { return m_camera; }

    entt::registry registry;
protected:
    std::shared_ptr<Camera> m_camera;
};