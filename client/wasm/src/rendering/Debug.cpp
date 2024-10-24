#include "Debug.h"

#include <GLES3/gl3.h>
#include <vector>
#include <iostream>

GLDebugDrawer::GLDebugDrawer() : m_debugMode(0) {}

GLDebugDrawer::~GLDebugDrawer() {}

void GLDebugDrawer::drawLine(const btVector3& from, const btVector3& to, const btVector3& color) {
    DebugDraw::DrawLine({from.getX(), from.getY(), from.getZ()}, {to.getX(), to.getY(), to.getZ()}, {color.getX(), color.getY(), color.getZ()});
}
void GLDebugDrawer::drawContactPoint(const btVector3 &PointOnB, const btVector3 &normalOnB, btScalar distance, int lifeTime, const btVector3 &color) {
    drawSphere(PointOnB, 0.1f, color);
    drawLine(PointOnB, PointOnB + normalOnB * distance * 10, color);
}
void GLDebugDrawer::reportErrorWarning(const char *warningString) {
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
    m_debugDrawer.drawSphere({p.x, p.y, p.z}, radius, {color.x, color.y, color.z});
}
void DebugDraw::DrawTriangle(const glm::vec3& a, const glm::vec3& b, const glm::vec3& c, const glm::vec3& color) {
    if (!m_enabled) return;
    m_debugDrawer.drawTriangle({a.x, a.y, a.z}, {b.x, b.y, b.z}, {c.x, c.y, c.z}, {color.x, color.y, color.z}, 0);
}
void DebugDraw::DrawContactPoint(const glm::vec3& point, const glm::vec3& normal, float distance, const glm::vec3& color) {
    if (!m_enabled) return;
    m_debugDrawer.drawContactPoint({point.x, point.y, point.z}, {normal.x, normal.y, normal.z}, distance, 0, {color.x, color.y, color.z});
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