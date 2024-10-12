import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainModule } from '../../../wasm/interface/wasmInterface';
import { loadWasmModule } from './wasmLoader';
import CustomButton from '../../components/buttons/customButton';

const Mode3Page: React.FC = () => {
    const navigate = useNavigate();

    const [module, setModule] = useState<MainModule | undefined>(undefined);

    useEffect(() => {
        console.log("Loading mode3 wasm module ...");
        loadWasmModule().then((val) => {
            setModule(val);
            console.log("Mode3 wasm module loaded.");
        });
    }, []);

    useEffect(() => {
        if (module === undefined) return;
        
        // cast to any to avoid TypeScript error, canvas is not generated in the type definition
        (module as any)['canvas'] = document.getElementById('canvas') as HTMLCanvasElement;

        // try-catch is a must because emscripten_set_main_loop() throws to exit the function
        try {
            module.start();
        } catch (error) {}
    }, [module]);

    return (
        <div className='Mode1_content'>
            <div className="MainBoard_mode1 w-full h-full" id="mode1Div">
                <div className='w-full h-full'>
                    <canvas
                        id="canvas"
                        className='ml-80 mt-2'
                        width="800"
                        height="600"
                        onFocus={() => module?.setFocused(true)}
                        onBlur={() => module?.setFocused(false)}
                        tabIndex={-1}
                    />
                </div>
                <div className="mode1_lowerDiv" id="buttonDiv">
                    <CustomButton label="Return" className="wideButton" id="MainBoard_returnButton" onClick={() => navigate("/home")}/>
                </div>
            </div>
        </div>
    );
};

export default Mode3Page;