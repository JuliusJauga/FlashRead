comp=em++ \
	$(call rwildcard,./src,*.cpp) \
	-lembind \
	-o interface/wasmInterface.js \
	--emit-tsd wasmInterface.d.ts \
	--std=c++23 \
	-sUSE_SDL=2 \
	-sMODULARIZE=1 \
	-sEXPORT_ES6=1 \
	-sENVIRONMENT="web" \
	-sMIN_WEBGL_VERSION=2 \
	-sMAX_WEBGL_VERSION=2 \
	-sALLOW_MEMORY_GROWTH=1 \
	-sFILESYSTEM=0 \
	-I dependencies/glm/include \
	-D GLM_FORCE_PURE \
	-D GLM_ENABLE_EXPERIMENTAL \
	-I dependencies/entt/include

prod:
	$(comp) \
	-O2 \
	-flto=full \
	-fno-exceptions

debug:
	$(comp) \
	-O0 \
	-g \
	--tracing

build-obj:
	clang++ -o objpacker/objpacker objpacker/main.cpp \
	-I dependencies/glm/include \
	&& objpacker/objpacker

rwildcard=$(foreach d,$(wildcard $(1:=/*)),$(call rwildcard,$d,$2) $(filter $(subst *,%,$2),$d))