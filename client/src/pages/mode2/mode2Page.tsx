import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../boards/css/main.board.css';
import CustomButton from '../../components/buttons/customButton';
import '../../boards/css/buttons.css';
import Mode2Task from './mode2Task';

const Mode2Page: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className='Mode1_content'>
            <div className="mode2_centerDiv" id="mode1Div">
                <div className="w-full h-full">
                    <Mode2Task />
                </div>
                <div className="mode1_lowerDiv" id="buttonDiv">
                    <CustomButton label="Return" className="wideButton" id="MainBoard_returnButton" onClick={() => navigate("/home")}/>
                </div>
            </div>
        </div>
    );
};

export default Mode2Page;