#pragma once

#include <memory>

#include "io/RenderTarget.h"
#include "rendering/Renderer.h"

struct Context {
    RenderTarget rt;
    Renderer renderer;
};