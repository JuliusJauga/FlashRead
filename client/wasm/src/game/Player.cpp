#include "Player.h"

#include "../io/Input.h"
#include <glm/gtx/norm.hpp>

Player::Player() {
    m_camera = std::make_shared<Camera>();
}

void Player::Update(btRigidBody* rigidBody, float dt) {
    UpdateInput(rigidBody, dt);
}
void Player::UpdateInput(btRigidBody* rigidBody, float dt) {
    // mouse
    glm::vec2 mousePos = Input::GetMousePosition();
    static glm::vec2 lastMousePos = mousePos;
    glm::vec2 mouseDelta = (mousePos - lastMousePos) * mouseSensitivity;
    lastMousePos = mousePos;

    if (Input::IsHeldMouse(SDL_BUTTON_LEFT)) m_camera->Rotate(mouseDelta.x, -mouseDelta.y);

    // keyboard
    float speed = moveSpeed;
    glm::vec3 velocity{0};
    if (Input::IsHeld(SDL_SCANCODE_W)) velocity += m_camera->GetFront();
    if (Input::IsHeld(SDL_SCANCODE_S)) velocity -= m_camera->GetFront();
    if (Input::IsHeld(SDL_SCANCODE_A)) velocity -= glm::normalize(glm::cross(m_camera->GetFront(), m_camera->GetUp()));
    if (Input::IsHeld(SDL_SCANCODE_D)) velocity += glm::normalize(glm::cross(m_camera->GetFront(), m_camera->GetUp()));
    if (Input::IsHeld(SDL_SCANCODE_SPACE)) velocity += m_camera->GetUp();
    if (Input::IsHeld(SDL_SCANCODE_LSHIFT)) velocity -= m_camera->GetUp();
    if (Input::IsHeld(SDL_SCANCODE_LCTRL)) speed *= 3.f;

    // normalize velocity to avoid faster diagonal movement
    if (glm::length2(velocity) > 0) {
        velocity = glm::normalize(velocity) * speed * dt;
        if (rigidBody) {
            rigidBody->activate(true);
            rigidBody->applyCentralImpulse({velocity.x, velocity.y, velocity.z});
        } else {
            m_camera->position += velocity;
        }
    }
}