import { useNavigate } from "react-router-dom";
import ModeButton from "./modeButton";
import OptionsButton from "./optionsButton";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-screen bg-gray-300">
            <h1 className="
                absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                text-9xl"
            >FlashRead</h1>
            <div className="m-auto space-x-16 flex items-center">
                <ModeButton label="Mode 1" onClick={() => navigate('/mode1')} />
                <ModeButton label="Mode 2" onClick={() => navigate('/mode2')} />
                <ModeButton label="Mode 3" onClick={() => navigate('/mode3')} />
            </div>
            <div className="absolute top-0 right-0">
                <OptionsButton />
            </div>
        </div>
    );
};

export default HomePage;