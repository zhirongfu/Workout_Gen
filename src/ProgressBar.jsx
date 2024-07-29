import { useContext } from 'react';
import { ProgressContext } from './Questionnaire';

function ProgressBar() {
    const { progress } = useContext(ProgressContext);


    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                ></div>
            </div>  
            <div className="progress-label">{progress}%</div>
        </div>
    );
}

export default ProgressBar;