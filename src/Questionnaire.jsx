import { createContext, useState } from 'react';
import ProgressBar from './ProgressBar';
import ProgressBarButton from './ProgressBarButton';
import QuestionnaireContent from './QuestionnaireContent';
export const ProgressContext = createContext();
export const DataContext = createContext();

function Questionnaire(){
    const [progress, setProgress] = useState(0);
    const [choices, setChoices] = useState({});

    return(
        <div>
            <div>
            <ProgressContext.Provider value={{ progress, setProgress }}>
                <DataContext.Provider value={{ choices, setChoices }}>
                    <ProgressBar />
                    <QuestionnaireContent />
                    <ProgressBarButton />
                </DataContext.Provider>
            </ProgressContext.Provider>
        </div>
        </div>
    );
}
export default Questionnaire