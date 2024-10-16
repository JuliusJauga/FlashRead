#include "Camera.h"

#include <glm/ext.hpp>

void Camera::Update(int32_t viewportWidth, int32_t viewportHeight) {
    if (viewportWidth == 0 || viewportHeight == 0) return;

    const float aspectRatio = static_cast<float>(viewportWidth) / static_cast<float>(viewportHeight);
    m_projectionMatrix = glm::perspective(glm::radians(fov), aspectRatio, m_near, m_far);
    m_viewMatrix = glm::lookAt(position, position + m_front, m_up);
    // m_viewMatrix = glm::lookAt(position, {0, 0, 0}, m_up);
}
void Camera::SetRotation(float yaw, float pitch) {
    // lock yaw to [0; 360]
    yaw = std::fmod(yaw, 360.f);
    yaw = yaw < 0 ? yaw + 360 : yaw;
    // lock pitch to [-89; 89]
    pitch = glm::clamp(pitch, -89.f, 89.f);
    
    m_front = {
        glm::cos(glm::radians(yaw)) * glm::cos(glm::radians(pitch)),
        glm::sin(glm::radians(pitch)),
        glm::sin(glm::radians(yaw)) * glm::cos(glm::radians(pitch))
    };
    this->m_yaw = yaw;
    this->m_pitch = pitch;
}
void Camera::Rotate(float yaw, float pitch) {
    SetRotation(m_yaw + yaw, m_pitch + pitch);
}