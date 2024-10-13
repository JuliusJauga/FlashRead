#pragma once

#include <memory>

#include "io/RenderTarget.h"
#include "rendering/Renderer.h"
#include "core/Scene.h"

struct Context {
    RenderTarget rt;
    Renderer renderer;
    std::shared_ptr<Scene> scene;
};