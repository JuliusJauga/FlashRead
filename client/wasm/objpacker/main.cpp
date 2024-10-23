#include <iostream>
#include <vector>
#include <string>
#include <filesystem>
#include <fstream>
#include <stdint.h>
#include <glm/glm.hpp>

#define TINYOBJLOADER_IMPLEMENTATION
#include "tiny_obj_loader.h"

constexpr bool SmoothNormals = true;

struct Vertex {
    glm::vec3 position{0};
    glm::vec3 normal{0};
};

bool CreateDirectoryRecursive(std::string const & dirName, std::error_code & err) {
    err.clear();
    if (!std::filesystem::create_directories(dirName, err)) {
        if (std::filesystem::exists(dirName)) {
            err.clear();
            return true;    
        }
        return false;
    }
    return true;
}

std::vector<std::filesystem::path> getFiles(const std::string& folderPath) {
    std::vector<std::filesystem::path> files;
    try {
        for (const auto& entry : std::filesystem::directory_iterator(folderPath)) {
            if (entry.is_regular_file()) {
                files.push_back(entry.path());
                std::cout << "Found file " << entry.path() << std::endl;
            }
        }
    } catch (const std::filesystem::filesystem_error& e) {
        std::cerr << "Filesystem error: " << e.what() << std::endl;
        return {};
    }
    std::cout << "Found " << files.size() << " files" << std::endl;
    return files;
}

void embedVertices(const std::vector<Vertex>& vertices, const std::filesystem::path& file) {
    std::error_code err;
    if (!CreateDirectoryRecursive(file.parent_path().string(), err)) {
        // Report the error:
        std::cout << "Failed to create directory for" << file << ": " << err.message() << std::endl;
    }
    std::ofstream out(file);
    if (!out.is_open()) {
        std::cerr << "Failed to open file " << file << std::endl;
        return;
    }

    out << "#pragma once\n\n";
    out << "#include <stdint.h>\n\n";
    out << "constexpr uint32_t " << file.stem().string() << "_vertexCount = " << vertices.size() << ";\n";
    out << "constexpr float " << file.stem().string() << "_vertices[] = {\n";
    for (const auto& vertex : vertices) {
        out << "    " << vertex.position.x << ", " << vertex.position.y << ", " << vertex.position.z << ", ";
        out << vertex.normal.x << ", " << vertex.normal.y << ", " << vertex.normal.z << ",\n";
    }
    out << "};\n";
    out.close();
    std::cout << "  Embedded vertices in " << file << std::endl;
}

void dumpVertices(const std::vector<Vertex>& vertices, const std::filesystem::path& file) {
    std::cout << "TODO: dump vertices" << std::endl;
}

std::vector<Vertex> loadModel(const std::filesystem::path& file) {
    // parse file
    std::cout << "File: " << file << std::endl;
    tinyobj::ObjReader reader;
    if (!reader.ParseFromFile(file.string())) {
        if (!reader.Error().empty()) {
            std::cerr << "  Error: " << reader.Error() << std::endl;
        }
        return {};
    }
    if (!reader.Warning().empty()) {
        std::cerr << "  Warning: " << reader.Warning() << std::endl;
    }

    const auto& attrib = reader.GetAttrib();
    std::cout << "  Vertex count: " << attrib.vertices.size() << std::endl;
    std::cout << "  Normal count: " << attrib.normals.size() << std::endl;

    std::vector<Vertex> vertices;
    for (const auto& shape : reader.GetShapes()) {
        auto& mesh = shape.mesh;
        for (const auto& index : mesh.indices) {
            Vertex vertex;
            vertex.position = {
                attrib.vertices[3 * index.vertex_index + 0],
                attrib.vertices[3 * index.vertex_index + 1],
                attrib.vertices[3 * index.vertex_index + 2]
            };
            if (index.normal_index != -1) {
                vertex.normal = {
                    attrib.normals[3 * index.normal_index + 0],
                    attrib.normals[3 * index.normal_index + 1],
                    attrib.normals[3 * index.normal_index + 2]
                };
            }
            vertices.push_back(vertex);
        }
    }
    if (attrib.normals.empty()) {
        std::cout << "  No normals found, creating from vertices ..." << std::endl;

        for (const auto& shape : reader.GetShapes()) {
            auto& mesh = shape.mesh;
            std::vector<glm::vec3> normals(mesh.indices.size());
            for (uint32_t i = 0; i < mesh.indices.size(); i += 3) {
                glm::vec3 pos1 {
                    attrib.vertices[3 * mesh.indices[i + 0].vertex_index + 0],
                    attrib.vertices[3 * mesh.indices[i + 0].vertex_index + 1],
                    attrib.vertices[3 * mesh.indices[i + 0].vertex_index + 2]
                };
                glm::vec3 pos2 {
                    attrib.vertices[3 * mesh.indices[i + 1].vertex_index + 0],
                    attrib.vertices[3 * mesh.indices[i + 1].vertex_index + 1],
                    attrib.vertices[3 * mesh.indices[i + 1].vertex_index + 2]
                };
                glm::vec3 pos3 {
                    attrib.vertices[3 * mesh.indices[i + 2].vertex_index + 0],
                    attrib.vertices[3 * mesh.indices[i + 2].vertex_index + 1],
                    attrib.vertices[3 * mesh.indices[i + 2].vertex_index + 2]
                };
                glm::vec3 normal = glm::normalize(glm::cross(pos2 - pos1, pos3 - pos1));
                for (uint32_t j = 0; j < 3; j++) {
                    if (SmoothNormals) normals[mesh.indices[i + j].vertex_index] += normal;
                    else normals[i + j] = normal;
                }
            }
            for (uint32_t i = 0; i < mesh.indices.size(); i++) {
                if (SmoothNormals) vertices[i].normal = glm::normalize(normals[mesh.indices[i].vertex_index]);
                else vertices[i].normal = normals[i];
            }
        }
    }
    std::cout << "  Loaded " << vertices.size() << " vertices" << std::endl;
    return vertices;
}

int main() {
    std::string inFolder = "models";
    std::string outFolder = "src/meshes";

    auto files = getFiles(inFolder);
    std::cout << std::endl;
    for (const auto& file : files) {
        auto vertices = loadModel(file);
        if (vertices.empty()) {
            std::cerr << "Failed to load model " << file << std::endl;
            continue;
        }
        auto outPath = std::filesystem::path(outFolder) / file.filename();
        outPath.replace_extension(".h");
        embedVertices(vertices, outPath);
    }
    return 0;
}