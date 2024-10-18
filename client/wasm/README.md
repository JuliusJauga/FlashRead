# Some controls:
P - reload shaders
O - show collision shapes


# To create .cpp files from .obj:
```
make
```
# To create wasm module and bindings:
`TARGET` = `debug` or `prod`.  
`debug` allows shader hot reloading. Needs `shader_provider.py` to be running.
```
mkdir build
cd build
emcmake cmake ..
cmake --build . --target TARGET
```