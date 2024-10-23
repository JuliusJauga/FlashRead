import { MainModule } from '../../../wasm/interface/wasmInterface';

export async function loadWasmModule(): Promise<MainModule> {
    const wasmModule = await import('../../../wasm/interface/wasmInterface.js');
    return await wasmModule.default();
}