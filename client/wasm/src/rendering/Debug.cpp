#include "Debug.h"

#include <GLES3/gl3.h>
#include <vector>
#include <iostream>

GLDebugDrawer::GLDebugDrawer() : m_debugMode(0) {}

GLDebugDrawer::~GLDebugDrawer() {}

void GLDebugDrawer::drawLine(const btVector3& from, const btVector3& to, const btVector3& fromColor, const btVector3& toColor) {
    drawLine(from, to, fromColor);
}
void GLDebugDrawer::drawLine(const btVector3& from, const btVector3& to, const btVector3& color) {
    DebugDraw::DrawLine({from.getX(), from.getY(), from.getZ()}, {to.getX(), to.getY(), to.getZ()}, {color.getX(), color.getY(), color.getZ()});
}
void GLDebugDrawer::drawSphere(const btVector3& p, btScalar radius, const btVector3& color) {
    DebugDraw::DrawSphere({p.getX(), p.getY(), p.getZ()}, radius, {color.getX(), color.getY(), color.getZ()});
}
void GLDebugDrawer::drawTriangle(const btVector3& a, const btVector3& b, const btVector3& c, const btVector3& color, btScalar alpha) {
    DebugDraw::DrawTriangle({a.getX(), a.getY(), a.getZ()}, {b.getX(), b.getY(), b.getZ()}, {c.getX(), c.getY(), c.getZ()}, {color.getX(), color.getY(), color.getZ()});
}
void GLDebugDrawer::drawContactPoint(const btVector3& PointOnB, const btVector3& normalOnB, btScalar distance, int lifeTime, const btVector3& color) {
    DebugDraw::DrawContactPoint({PointOnB.getX(), PointOnB.getY(), PointOnB.getZ()}, {normalOnB.getX(), normalOnB.getY(), normalOnB.getZ()}, distance, {color.getX(), color.getY(), color.getZ()});
}
void GLDebugDrawer::reportErrorWarning(const char* warningString) {
    std::cerr << "Bullet warning: " << warningString << std::endl;
}
void GLDebugDrawer::draw3dText(const btVector3& location, const char* textString) {}
void GLDebugDrawer::setDebugMode(int debugMode) {
    m_debugMode = debugMode;
}

void DebugDraw::Init() {
    if (m_vao) return;
    glGenVertexArrays(1, &m_vao);
    glBindVertexArray(m_vao);
    glGenBuffers(1, &m_vbo);
    glBindBuffer(GL_ARRAY_BUFFER, m_vbo);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(vert), (void*)offsetof(vert, position));
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(vert), (void*)offsetof(vert, color));
    glBindVertexArray(0);
}
void DebugDraw::Draw() {
    if (!m_enabled) return;
    if (m_vertices.empty()) return;

    glBindVertexArray(m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m_vbo);
    glBufferData(GL_ARRAY_BUFFER, m_vertices.size() * sizeof(vert), m_vertices.data(), GL_DYNAMIC_DRAW);
    glDrawArrays(GL_LINES, 0, m_vertices.size());
    m_vertices.clear();
}
void DebugDraw::DrawLine(const glm::vec3& from, const glm::vec3& to, const glm::vec3& color) {
    if (!m_enabled) return;
    m_vertices.push_back({from, color});
    m_vertices.push_back({to, color});
}
void DebugDraw::DrawSphere(const glm::vec3& p, float radius, const glm::vec3& color) {
    if (!m_enabled) return;
    // TODO
}
void DebugDraw::DrawTriangle(const glm::vec3& a, const glm::vec3& b, const glm::vec3& c, const glm::vec3& color) {
    if (!m_enabled) return;
    m_vertices.push_back({a, color});
    m_vertices.push_back({b, color});
    m_vertices.push_back({b, color});
    m_vertices.push_back({c, color});
    m_vertices.push_back({c, color});
    m_vertices.push_back({a, color});
}
void DebugDraw::DrawContactPoint(const glm::vec3& point, const glm::vec3& normal, float distance, const glm::vec3& color) {
    if (!m_enabled) return;
    m_vertices.push_back({point, color});
    m_vertices.push_back({point + normal * distance, color});
}

void DebugDraw::Enable() {
    m_debugDrawer.setDebugMode(btIDebugDraw::DBG_DrawWireframe);
    m_enabled = true;
}
void DebugDraw::Disable() {
    m_debugDrawer.setDebugMode(btIDebugDraw::DBG_NoDebug);
    m_enabled = false;
    m_vertices.clear();
}