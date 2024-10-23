#include <stdio.h>

#include <emscripten.h>
#include <emscripten/bind.h>

#include "Context.h"
#include "io/Input.h"
#include "game/TestScene.h"
#include "rendering/Mesh.h"
#include "rendering/Debug.h"
#include "util/Timer.h"
#include "vendor/imgui/imgui.h"
#include "vendor/imgui/imgui_impl_sdl2.h"
#include "vendor/imgui/imgui_impl_opengl3.h"

Context* ctx = nullptr;

void mainLoop() {
    // timing
    static auto lastTime = TimePoint();
    auto now = TimePoint();
    auto dt = now - lastTime;
    lastTime = now;

    // input
    Input::Poll(false);
    
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplSDL2_NewFrame();
    ImGui::NewFrame();

    // logic
    ctx->scene->Update(dt);

    // rendering
    #ifdef SHADER_HOT_RELOAD
        if (Input::JustPressed(SDL_SCANCODE_P)) ctx->renderer.ReloadShaders();
    #endif

    // debug draw
    if (Input::JustPressed(SDL_SCANCODE_O)) {
        if (DebugDraw::IsEnabled()) DebugDraw::Disable();
        else DebugDraw::Enable();
    }

    // rendering
    ctx->renderer.SetViewportSize(ctx->rt.width, ctx->rt.height);
    ctx->renderer.Render(ctx->scene);
    ctx->rt.SwapBuffers();
}

bool start() {
    // create context
    if (ctx != nullptr) {
        printf("Context already exists.\n");
        return false;
    }
    ctx = new Context();
    if (!ctx->rt.IsValid()) {
        printf("Failed to create render target.\n");
        delete ctx;
        return false;
    }
    DebugDraw::Init();
    // create scene (TODO: offload to game logic or something)
    ctx->scene = std::make_shared<TestScene>();
    // start main loop
    emscripten_set_main_loop(mainLoop, 0, 1);
    return true;
}
void stop() {
    MeshRegistry::Clear();
    emscripten_cancel_main_loop();
    if (ctx == nullptr) return;
    delete ctx;
    ctx = nullptr;
}
void setFocused(bool focused) {
    if (ctx == nullptr) return;
    ctx->rt.SetFocused(focused);
}

// export functions to JS
EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("start", &start);
    emscripten::function("stop", &stop);
    emscripten::function("setFocused", &setFocused);
}