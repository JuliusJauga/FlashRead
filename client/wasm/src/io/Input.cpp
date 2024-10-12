#include "Input.h"

void Input::Poll(bool resetHeld) {
    // reset keys
    for (auto& key : m_keys) {
        if (resetHeld) key.hold = false;
        key.press = false;
        key.release = false;
    }
    // m_scrollOffsetX = 0;
    // m_scrollOffsetY = 0;
    
    // poll new events
    SDL_Event event;
    while(SDL_PollEvent(&event)) {
        if (event.key.repeat) continue;
        switch(event.type) {
            case SDL_KEYDOWN: {
                auto& key = m_keys[event.key.keysym.scancode];
                key.press = true;
                key.hold = true;
                key.release = false;
                break;
            }
            case SDL_KEYUP: {
                auto& key = m_keys[event.key.keysym.scancode];
                key.press = false;
                key.hold = false;
                key.release = true;
                break;
            }
            default:
                break;
        }
    }
}
bool Input::JustPressed(SDL_Scancode key) {
    return m_keys[key].press;
}
bool Input::IsHeld(SDL_Scancode key) {
    return m_keys[key].hold;
}
bool Input::JustReleased(SDL_Scancode key) {
    return m_keys[key].release;
}