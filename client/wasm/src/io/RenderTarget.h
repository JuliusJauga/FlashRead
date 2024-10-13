#pragma once

#include <emscripten.h>
#include <SDL2/SDL.h>
#include <GLES3/gl3.h>
#include <stdint.h>

class RenderTarget {
public:
    RenderTarget();
    ~RenderTarget();
    RenderTarget(const RenderTarget&) = delete;
    RenderTarget& operator=(const RenderTarget&) = delete;
    RenderTarget(RenderTarget&&) = delete;
    RenderTarget& operator=(RenderTarget&&) = delete;

    void SetFocused(bool focused);
    void Resize(int32_t width, int32_t height);
    void SwapBuffers();

    bool IsValid() const { return m_valid; }

    int32_t width, height;

private:
    SDL_Window* m_window;
    SDL_GLContext m_context;
    bool m_valid = false;
};