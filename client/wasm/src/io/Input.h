#pragma once

#include <SDL2/SDL.h>

class Input {
public:
    Input() = delete;
    
    static void Poll(bool resetHeld);
    static bool JustPressed(SDL_Scancode key);
    static bool IsHeld(SDL_Scancode key);
    static bool JustReleased(SDL_Scancode key);
    // static glm::vec2 GetMousePosition();
    // static float GetMouseScrollX();
    // static float GetMouseScrollY();

private:
    struct KeyState {
        bool press;
        bool release;
        bool hold;
    };
    static inline KeyState m_keys[SDL_NUM_SCANCODES];
    // static inline float m_scrollOffsetX = 0;
    // static inline float m_scrollOffsetY = 0;
};