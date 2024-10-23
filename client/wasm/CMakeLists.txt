cmake_minimum_required(VERSION 3.12)
project(wasmgame)
set(CMAKE_CXX_STANDARD 23)

set(SOURCE_LOC src)
set(DEPS_LOC dependencies)
set(OUTPUT_LOC interface)

file(GLOB_RECURSE SRC_FILES CONFIGURE_DEPENDS "${SOURCE_LOC}/*.cpp")
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

set(CMAKE_EXECUTABLE_SUFIX ".wasm")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/${OUTPUT_LOC})
set(COMMON_COMP_OPT
    --std=c++23
    -sUSE_SDL=2 	
	-DGLM_FORCE_PURE
	-DGLM_ENABLE_EXPERIMENTAL
)
set(COMMON_LINK_OPT
    --emit-tsd wasmInterface.d.ts
    -lembind
    -lSDL2
    -sMODULARIZE=1
    -sEXPORT_ES6=1
    -sENVIRONMENT="web"
    -sMIN_WEBGL_VERSION=2
    -sMAX_WEBGL_VERSION=2
    -sALLOW_MEMORY_GROWTH=1
    -sFILESYSTEM=0
)


# deps
add_subdirectory(${DEPS_LOC}/bullet3)

# DEBUG
add_executable(debug ${SRC_FILES})
set_target_properties(debug PROPERTIES OUTPUT_NAME "wasmInterface")
target_compile_options(debug PRIVATE ${COMMON_COMP_OPT}
    -O0
	-g
	--tracing
	-DSHADER_HOT_RELOAD
)
target_link_options(debug PRIVATE ${COMMON_LINK_OPT}
    -sFETCH
    -sASYNCIFY
)

target_include_directories(debug PRIVATE ${DEPS_LOC}/glm/include)
target_include_directories(debug PRIVATE ${DEPS_LOC}/entt/include)
target_include_directories(debug PRIVATE ${DEPS_LOC}/bullet3/src)
target_link_libraries(debug PRIVATE BulletDynamics BulletCollision LinearMath)

# PROD
add_executable(prod ${SRC_FILES})
set_target_properties(prod PROPERTIES OUTPUT_NAME "wasmInterface")
target_compile_options(prod PRIVATE ${COMMON_COMP_OPT}
-O2
-flto=full
-fno-exceptions
)
target_link_options(prod PRIVATE ${COMMON_LINK_OPT})

target_include_directories(prod PRIVATE ${DEPS_LOC}/glm/include)
target_include_directories(prod PRIVATE ${DEPS_LOC}/entt/include)
target_include_directories(prod PRIVATE ${DEPS_LOC}/bullet3/src)
target_link_libraries(prod PRIVATE BulletDynamics BulletCollision LinearMath)