import { useNavigate } from "react-router-dom";
import Dropdown from '../../components/dropdown';
import CustomButton from '../../components/buttons/customButton';
import '../../boards/css/main.board.css';
import '../../boards/css/dropdown.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="MainBoard_main">

            <div className="MainBoard_header" id="headerDiv">
                <Dropdown onSelect={function (item: string): void {
                if (item === "Login") {
                    navigate("/login");
                }
                } } />
            </div>

            <div className="MainBoard_content" id="contentDiv"> 
                <div className="MainBoard_selection" id="selectionDiv">

                    <div className="MainBoard_grid" id="selectionGrid">

                        <CustomButton label= "Mode 1" className= "squareButton" id="MainBoard_mode1Button" onClick={()=>{
                            console.log("Mode 1 clicked");
                            navigate("/mode1");
                        }}/>

                        <CustomButton label= "Mode 2" className= "squareButton" id="MainBoard_mode2Button" onClick={()=>{
                            console.log("Mode 2 clicked");
                            navigate("/mode2");
                        }}/>

                        <CustomButton label= "Mode 3" className= "squareButton" id="MainBoard_mode3Button" onClick={()=>{
                            console.log("Mode 3 clicked");
                            const mode3Button = document.getElementById("MainBoard_mode3Button") as HTMLButtonElement;
                            mode3Button.textContent = "Coming Soon";
                            setTimeout(() => {
                            mode3Button.textContent = "Mode 3";
                            }, 1000);
                        }}/>

                    </div>

                </div>        

            </div>

        </div>    

        // <div className="flex flex-col h-screen bg-gray-300">
        //     <h1 className="
        //         absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
        //         text-9xl"
        //     >FlashRead</h1>
        //     <div className="m-auto space-x-16 flex items-center">
        //         <ModeButton label="Mode 1" onClick={() => navigate('/mode1')} />
        //         <ModeButton label="Mode 2" onClick={() => navigate('/mode2')} />
        //         <ModeButton label="Mode 3" onClick={() => navigate('/mode3')} />
        //     </div>
        //     <div className="absolute top-0 right-0">
        //         <OptionsButton />
        //     </div>
        // </div>
    );
};

export default HomePage;