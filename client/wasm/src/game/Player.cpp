#include "Player.h"

#include "../io/Input.h"
#include <glm/gtx/norm.hpp>

Player::Player(PhysicsWorld& physicsWorld, const glm::vec3& position)
    : m_physicsWorld(physicsWorld) {
    m_camera = std::make_shared<Camera>();
    m_camera->position = position;

    auto collider = m_physicsWorld.get().GetCapsuleCollider(1, 2);
    m_rigidBody = m_physicsWorld.get().CreateRigidBody(collider, 5.f, position, {0, 0, 0});
    m_rigidBody->setAngularFactor(btVector3(0, 0, 0));
    m_rigidBody->setFriction(8.f);
}
Player::~Player() {
    Cleanup();
}
Player::Player(Player&& other) noexcept
    : m_physicsWorld(other.m_physicsWorld), m_rigidBody(other.m_rigidBody), m_camera(other.m_camera) {
    other.m_rigidBody = nullptr;
}
Player& Player::operator=(Player&& other) noexcept {
    if (this != &other) {
        Cleanup();
        m_physicsWorld = other.m_physicsWorld;
        m_camera = std::move(other.m_camera);
        m_rigidBody = other.m_rigidBody;
        other.m_rigidBody = nullptr;
    }
    return *this;
}
void Player::Cleanup() {
    if (!m_rigidBody) return;
    m_physicsWorld.get().DestroyRigidBody(m_rigidBody);
    m_rigidBody = nullptr;
}

void Player::Update(float dt) {
    UpdateInput(dt);
}
void Player::UpdateCameraAfterPhysics()
{
    btTransform transform;
    if (m_rigidBody->getMotionState()) m_rigidBody->getMotionState()->getWorldTransform(transform);
    else transform = m_rigidBody->getWorldTransform();

    m_camera->position = {transform.getOrigin().x(), transform.getOrigin().y() + 1.f, transform.getOrigin().z()};
}
void Player::UpdateInput(float dt) {
    // user data
    auto userData = static_cast<RigidBodyUserData*>(m_rigidBody->getUserPointer());

    // mouse
    glm::vec2 mousePos = Input::GetMousePosition();
    static glm::vec2 lastMousePos = mousePos;
    glm::vec2 mouseDelta = (mousePos - lastMousePos) * mouseSensitivity;
    lastMousePos = mousePos;

    if (Input::IsHeldMouse(SDL_BUTTON_LEFT)) m_camera->Rotate(mouseDelta.x, -mouseDelta.y);

    // keyboard
    glm::vec3 front = m_camera->GetFront();
    if (!fly) {
        front.y = 0;
        front = glm::normalize(front);
    }

    float speed = moveSpeed;
    glm::vec3 velocity{0};
    
    if (Input::IsHeld(SDL_SCANCODE_LCTRL)) speed *= 3.f;
    
    if (Input::IsHeld(SDL_SCANCODE_W)) velocity += front;
    if (Input::IsHeld(SDL_SCANCODE_S)) velocity -= front;
    if (Input::IsHeld(SDL_SCANCODE_A)) velocity -= glm::cross(front, m_camera->GetUp());
    if (Input::IsHeld(SDL_SCANCODE_D)) velocity += glm::cross(front, m_camera->GetUp());
    // normalize velocity to avoid faster diagonal movement
    if (glm::length2(velocity) > 0) {
        velocity = glm::normalize(velocity) * speed * dt;
    }

    if (fly && Input::IsHeld(SDL_SCANCODE_LSHIFT)) velocity -= m_camera->GetUp();
    if ((fly || (userData->onGround && TimePoint() - m_lastJump > 250ms)) && Input::IsHeld(SDL_SCANCODE_SPACE)) {
        velocity += m_camera->GetUp();
        m_lastJump.reset();
    }
    if (!userData->onGround) {
        velocity *= 0.5f;
    }

    if (glm::length2(velocity) > 0) {
        if (fly) {
            m_camera->position += velocity;
        } else {
            m_rigidBody->activate(true);
            velocity *= 35.f;
            float oldY = m_rigidBody->getLinearVelocity().getY();
            velocity.y += oldY;
            m_rigidBody->setLinearVelocity({velocity.x, velocity.y, velocity.z});
        }
    }
}