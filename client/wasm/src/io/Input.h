#pragma once

#include <SDL2/SDL.h>
#include <glm/vec2.hpp>

class Input {
public:
    Input() = delete;
    
    static void Poll(bool resetHeld);
    static bool JustPressed(SDL_Scancode key);
    static bool IsHeld(SDL_Scancode key);
    static bool JustReleased(SDL_Scancode key);
    static glm::vec2 GetMousePosition();
    static bool JustPressedMouse(uint32_t button);
    static bool IsHeldMouse(uint32_t button);
    static bool JustReleasedMouse(uint32_t button);
    static float GetMouseScrollX();
    static float GetMouseScrollY();

private:
    static constexpr inline int m_buttonCount = 10; // arbitrary number, maby someone has that crazy mouse
    struct KeyState {
        bool press;
        bool release;
        bool hold;
    };
    static inline KeyState m_keys[SDL_NUM_SCANCODES];
    static inline KeyState m_buttons[m_buttonCount];
    static inline float m_scrollOffsetX = 0;
    static inline float m_scrollOffsetY = 0;
};