#pragma once

#include <vector>
#include <btBulletDynamicsCommon.h>
#include <glm/glm.hpp>

class GLDebugDrawer : public btIDebugDraw {
public:
    GLDebugDrawer();
    virtual ~GLDebugDrawer(); 

    virtual void drawLine(const btVector3& from, const btVector3& to, const btVector3& fromColor, const btVector3& toColor);
    virtual void drawLine(const btVector3& from, const btVector3& to, const btVector3& color);
    virtual void drawSphere(const btVector3& p, btScalar radius, const btVector3& color);
    virtual void drawTriangle(const btVector3& a, const btVector3& b, const btVector3& c, const btVector3& color, btScalar alpha);
    virtual void drawContactPoint(const btVector3& PointOnB, const btVector3& normalOnB, btScalar distance, int lifeTime, const btVector3& color);
    virtual void reportErrorWarning(const char* warningString);
    virtual void draw3dText(const btVector3& location, const char* textString);
    virtual void setDebugMode(int debugMode);
    virtual int getDebugMode() const { return m_debugMode; }

private:
    int m_debugMode;
};

class DebugDraw {
public:
    DebugDraw() = delete;

    static void Init();
    static void Draw();

    static void DrawLine(const glm::vec3& from, const glm::vec3& to, const glm::vec3& color);
    static void DrawSphere(const glm::vec3& p, float radius, const glm::vec3& color);
    static void DrawTriangle(const glm::vec3& a, const glm::vec3& b, const glm::vec3& c, const glm::vec3& color);
    static void DrawContactPoint(const glm::vec3& point, const glm::vec3& normal, float distance, const glm::vec3& color);

    static GLDebugDrawer* GetDrawer() { return &m_debugDrawer; }

    static void Enable();
    static void Disable();
    static bool IsEnabled() { return m_enabled; }
private:
    struct vert {
        glm::vec3 position;
        glm::vec3 color;
    };

    static inline bool m_enabled = false;
    static inline GLDebugDrawer m_debugDrawer;
    static inline std::vector<vert> m_vertices;
    static inline uint32_t m_vao, m_vbo;
};