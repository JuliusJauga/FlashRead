prod:
	em++ \
	$(call rwildcard,./src,*.cpp) \
	-lembind \
	-o interface/wasmInterface.js \
	--emit-tsd wasmInterface.d.ts \
	-O2 \
	-flto=full \
	-fno-exceptions \
	-sUSE_SDL=2 \
	-sMODULARIZE=1 \
	-sEXPORT_ES6=1 \
	-sENVIRONMENT="web" \
	-sFILESYSTEM=0

debug:
	em++ \
	$(call rwildcard,./src,*.cpp) \
	-lembind \
	-o interface/wasmInterface.js \
	--emit-tsd wasmInterface.d.ts \
	-O0 \
	-g \
	--tracing \
	-sUSE_SDL=2 \
	-sMODULARIZE=1 \
	-sEXPORT_ES6=1 \
	-sENVIRONMENT="web" \
	-sFILESYSTEM=0

rwildcard=$(foreach d,$(wildcard $(1:=/*)),$(call rwildcard,$d,$2) $(filter $(subst *,%,$2),$d))