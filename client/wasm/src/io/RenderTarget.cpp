#include "RenderTarget.h"

#include <emscripten/html5.h>

RenderTarget::RenderTarget() {
    // get initial size
    if (emscripten_get_canvas_element_size("#canvas", &width, &height) != EMSCRIPTEN_RESULT_SUCCESS) {
        printf("emscripten_get_canvas_element_size Error: could not get canvas size.\n");
        return;
    }
    
    // init sdl
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        printf("SDL_Init Error: %s\n", SDL_GetError());
        return;
    }

    // Create SDL window
    SetFocused(false);
    m_window = SDL_CreateWindow("mode3", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, width, height, SDL_WINDOW_OPENGL);
    if (m_window == nullptr) {
        printf("SDL_CreateWindow Error: %s\n", SDL_GetError());
        return;
    }

    // Create webgl context
    if (SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1) != 0) {
        printf("SDL_GL_SetAttribute Error: %s\n", SDL_GetError());
        return;
    }
    if (SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE, 24) != 0) {
        printf("SDL_GL_SetAttribute Error: %s\n", SDL_GetError());
        return;
    }
    m_context = SDL_GL_CreateContext(m_window);
    if (m_context == nullptr) {
        printf("SDL_GL_CreateContext Error: %s\n", SDL_GetError());
        return;
    }
    if (SDL_GL_SetSwapInterval(1) != 0) {
        printf("SDL_GL_SetSwapInterval Error: %s\n", SDL_GetError());
        return;
    }

    // handle resize
    emscripten_set_resize_callback(EMSCRIPTEN_EVENT_TARGET_WINDOW, this, true,
    [](int eventType, const EmscriptenUiEvent* uiEvent, void* userData) -> EM_BOOL {
        RenderTarget* rt = static_cast<RenderTarget*>(userData);
        int32_t width;
        int32_t height;
        if (emscripten_get_canvas_element_size("#canvas", &width, &height) != EMSCRIPTEN_RESULT_SUCCESS) {
            printf("emscripten_get_canvas_element_size Error: could not get canvas size.\n");
            return false;
        }
        rt->Resize(width, height);
        return true;
    });
    Resize(width, height);

    m_valid = true;
}
RenderTarget::~RenderTarget() {
    emscripten_set_resize_callback(EMSCRIPTEN_EVENT_TARGET_WINDOW, nullptr, true, nullptr);
    if (m_context) SDL_GL_DeleteContext(m_context);
    if (m_window) SDL_DestroyWindow(m_window);
    SDL_Quit();
}

void RenderTarget::SetFocused(bool focused) {
    if (focused) SDL_ResetHint(SDL_HINT_EMSCRIPTEN_KEYBOARD_ELEMENT);
    else SDL_SetHint(SDL_HINT_EMSCRIPTEN_KEYBOARD_ELEMENT, "#canvas");
}

void RenderTarget::Resize(int32_t width, int32_t height) {
    this->width = width;
    this->height = height;
    if (!IsValid()) return;
    SDL_SetWindowSize(m_window, width, height);
}

void RenderTarget::SwapBuffers() {
    if (!IsValid()) return;
    SDL_GL_SwapWindow(m_window);
}
