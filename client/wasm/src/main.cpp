#include <stdio.h>

#include <emscripten.h>
#include <emscripten/bind.h>

#include "Context.h"
#include "io/Input.h"
#include "game/TestScene.h"
#include "rendering/Mesh.h"

Context* ctx = nullptr;

void mainLoop() {
    Input::Poll(false);
    
    // logic
    ctx->scene->Update();

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