#pragma once

#include <GLES3/gl3.h>
#include <stdint.h>
#include <string_view>
#include <string>
#include <unordered_map>

#include "Vertex.h"

class MeshImpl;
using Mesh = MeshImpl*;

class MeshImpl {
public:
    MeshImpl(std::string_view name);
    ~MeshImpl();
    MeshImpl(const MeshImpl&) = delete;
    MeshImpl& operator=(const MeshImpl&) = delete;

    void Load(std::size_t vertexCount, const Vertex* vertices, const glm::mat4& model = glm::mat4(1));
    void Unload();
    const std::string& GetName() const { return m_name; }
    GLuint GetVAO() const { return m_vao; }
    std::size_t GetDrawCount() const { return m_drawCount; }

private:
    std::string m_name;
    GLuint m_vao;
    GLuint m_vbo;
    std::size_t m_drawCount;
};

class MeshRegistry {
public:
    MeshRegistry() = delete;
    ~MeshRegistry() = delete;

    static Mesh Create(std::string_view name);
    static Mesh Get(std::string_view name);
    static void Destroy(std::string_view name);
    static void Clear();
private:
    static inline std::unordered_map<std::string, MeshImpl> m_meshes;
};