#include <stdio.h>

#include <emscripten.h>
#include <emscripten/bind.h>

#include "Context.h"
#include "io/Input.h"

Context* ctx = nullptr;

void mainLoop() {
    Input::Poll(false);

    // logic

    // rendering
    ctx->renderer.Render();
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

    // start main loop
    emscripten_set_main_loop(mainLoop, 0, 1);
    return true;
}
void stop() {
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