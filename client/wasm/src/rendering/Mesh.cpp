#include "Mesh.h"

#include <vector>

MeshImpl::MeshImpl(std::string_view name)
    : m_name(name) {
    glGenVertexArrays(1, &m_vao);
    glGenBuffers(1, &m_vbo);
}
MeshImpl::~MeshImpl() {
    if (m_vao == 0) return;
    glDeleteBuffers(1, &m_vbo);
    glDeleteVertexArrays(1, &m_vao);
}

void MeshImpl::Load(std::size_t vertexCount, const Vertex *vertices, const glm::mat4& model) {
    std::vector<Vertex> verts;
    if (model != glm::mat4(1)) {
        verts.resize(vertexCount);
        for (std::size_t i = 0; i < vertexCount; i++) {
            verts[i].position = model * glm::vec4(vertices[i].position, 1);
            verts[i].normal = glm::normalize(glm::transpose(glm::inverse(glm::mat3(model))) * vertices[i].normal);
        }
        vertices = verts.data();
    }

    glBindBuffer(GL_ARRAY_BUFFER, m_vbo);
    glBufferData(GL_ARRAY_BUFFER, sizeof(Vertex) * vertexCount, vertices, GL_STATIC_DRAW);
    glBindVertexArray(m_vao);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, position));
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, normal));

    m_drawCount = vertexCount;
}
void MeshImpl::Unload() {
    glBindBuffer(GL_ARRAY_BUFFER, m_vbo);
    glBufferData(GL_ARRAY_BUFFER, 0, nullptr, GL_STATIC_DRAW);
    m_drawCount = 0;
}

Mesh MeshRegistry::Create(std::string_view name) {
    auto it = m_meshes.emplace(std::string(name), name);
    return &(it.first->second);
}
Mesh MeshRegistry::Get(std::string_view name) {
    auto it = m_meshes.find(std::string(name));
    if (it != m_meshes.end()) return &(it->second);
    return nullptr;
}
void MeshRegistry::Destroy(std::string_view name) {
    m_meshes.erase(std::string(name));
}
void MeshRegistry::Clear() {
    m_meshes.clear();
}
