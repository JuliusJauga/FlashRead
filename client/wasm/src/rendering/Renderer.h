#pragma once

#include <memory>
#include "ShaderProgram.h"

class Renderer {
public:
    Renderer();
    ~Renderer();
    Renderer(const Renderer&) = delete;
    Renderer& operator=(const Renderer&) = delete;
    Renderer(Renderer&&) = delete;
    Renderer& operator=(Renderer&&) = delete;

    void Render();

    std::unique_ptr<ShaderProgram> mainProgram;
private:
};