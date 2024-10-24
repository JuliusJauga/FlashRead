#include "Input.h"

#include "../vendor/imgui/imgui_impl_sdl2.h"

void Input::Poll(bool resetHeld) {
    auto& io = ImGui::GetIO();
    if (io.WantCaptureMouse || io.WantCaptureKeyboard) resetHeld = true;

    // reset state
    for (auto& key : m_keys) {
        if (resetHeld) key.hold = false;
        key.press = false;
        key.release = false;
    }
    for (auto& button : m_buttons) {
        if (resetHeld) button.hold = false;
        button.press = false;
        button.release = false;
    }
    m_scrollOffsetX = 0;
    m_scrollOffsetY = 0;
    
    // poll new events
    SDL_Event event;
    while(SDL_PollEvent(&event)) {
        ImGui_ImplSDL2_ProcessEvent(&event);
        if (io.WantCaptureMouse || io.WantCaptureKeyboard) continue;
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
            case SDL_MOUSEWHEEL: {
                m_scrollOffsetX = event.wheel.x;
                m_scrollOffsetY = event.wheel.y;
                break;
            }
            case SDL_MOUSEBUTTONDOWN: {
                if (event.button.button >= m_buttonCount) break;
                auto& button = m_buttons[event.button.button];
                button.press = true;
                button.hold = true;
                button.release = false;
                break;
            }
            case SDL_MOUSEBUTTONUP: {
                if (event.button.button >= m_buttonCount) break;
                auto& button = m_buttons[event.button.button];
                button.press = false;
                button.hold = false;
                button.release = true;
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

glm::vec2 Input::GetMousePosition() {
    int x, y;
    SDL_GetMouseState(&x, &y);
    return {x, y};
}

bool Input::JustPressedMouse(uint32_t button) {
    if (button >= m_buttonCount) return false;
    return m_buttons[button].press;
}
bool Input::IsHeldMouse(uint32_t button) {
    if (button >= m_buttonCount) return false;
    return m_buttons[button].hold;
}
bool Input::JustReleasedMouse(uint32_t button) {
    if (button >= m_buttonCount) return false;
    return m_buttons[button].release;
}

float Input::GetMouseScrollX() {
    return m_scrollOffsetX;
}
float Input::GetMouseScrollY() {
    return m_scrollOffsetY;
}
