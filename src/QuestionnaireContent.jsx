import React, { useContext, useState } from 'react';
import { ProgressContext } from './Questionnaire';
import { DataContext } from './Questionnaire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson, faPersonDress, faCakeCandles, faDumbbell, faPersonRunning, faHandFist, faCalendarDays, faHouse } from '@fortawesome/free-solid-svg-icons';
// Define your question components
function Question1({ nextQuestion, updateChoices }) {
    return (
        <div className='q1div'>
            <h1 className='q1text'>SELECT GENDER:</h1>
            <button className='q1btn' onClick={() => { updateChoices({ gender: 'Male' }); nextQuestion(); updateChoices({ age: '18'}); updateChoices({ days_available: '3' }) }}>
                <FontAwesomeIcon className='personicon' icon={faPerson} />
            </button>
            <button className='q1btn' onClick={() => { updateChoices({ gender: 'Female' }); nextQuestion(); }}>
                <FontAwesomeIcon className='personicon1' icon={faPersonDress} />
            </button>
        </div>
    );
}

function Question2({ nextQuestion, updateChoices, choices }) {
    const [age, setAge] = useState(choices.age || 18);

    const handleSliderChange = (event) => {
        setAge(event.target.value);
        updateChoices({ age: event.target.value });
    };

    return (
        <div className="question-slider-container">
            <FontAwesomeIcon className='cakeicon' icon={faCakeCandles} />
            <div className="slider-wrapper">
                <label className="age-label" htmlFor="age-slider">Age:</label>
                <input
                    type="range"
                    id="age-slider"
                    name="age"
                    min="12"
                    max="100"
                    value={age}
                    onChange={handleSliderChange}
                    className="slider"
                />
                <input
                    type="number"
                    id="age-input"
                    value={age}
                    onChange={handleSliderChange}
                    className="age-input"
                />
            </div>
        </div>
    );
}

const Question3 = ({ nextQuestion, updateChoices, choices }) => {
    return (
        <div className='q1div'>
            <h1 className='q1text'>GOAL:</h1>
            <button className='q1btn' onClick={() => { updateChoices({ goal: 'Build Muscles' }); nextQuestion(); }}>
                <span className='q3text'>Build Muscles</span>
                <FontAwesomeIcon className='personicon' icon={faDumbbell} />
            </button>
            <button className='q1btn' onClick={() => { updateChoices({ goal: 'Lose Weight' }); nextQuestion(); }}>
                <span className='q3text'>Lose Weight</span>
                <FontAwesomeIcon className='personicon' icon={faPersonRunning} />
            </button>
            <button className='q1btn' onClick={() => { updateChoices({ goal: 'Strength' }); nextQuestion(); }}>
                <span className='q3text'>Strength</span>
                <FontAwesomeIcon className='personicon' icon={faHandFist} />
            </button>
        </div>
    );
}

function Question4({ nextQuestion, previousQuestion, updateChoices, choices }) {
    const [day, setDay] = useState(choices.days_available || 3);

    const handleSliderChange = (event) => {
        setDay(event.target.value);
        updateChoices({ days_available: event.target.value });
    };

    return (
        <div className="question-slider-container">
            <FontAwesomeIcon className='cakeicon' icon={faCalendarDays} />
            <div className="slider-wrapper">
                <label className="age-label" htmlFor="day-slider">Days Available/Week:</label>
                <input
                    type="range"
                    id="day-slider"
                    name="day"
                    min="1"
                    max="7"
                    value={day}
                    onChange={handleSliderChange}
                    className="slider"
                />
                <input
                    type="number"
                    id="day-input"
                    value={day}
                    onChange={handleSliderChange}
                    className="age-input"
                />
            </div>
        </div>
    );
}

function Question5({ nextQuestion, updateChoices, choices }) {
    return (
        <div className='q1div'>
            <h1 className='q1text'>Area Of Workout:</h1>
            <button className='q1btn' onClick={() => { updateChoices({ area: 'Gym' }); nextQuestion(); }}>
                <span className='q3text'>Gym</span>
                <FontAwesomeIcon className='personicon' icon={faDumbbell} />
            </button>
            <button className='q1btn' onClick={() => { updateChoices({ area: 'Home' }); nextQuestion(); }}>
                <span className='q3text'>Home</span>
                <FontAwesomeIcon className='personicon' icon={faHouse} />
            </button>
        </div>
    );
}

function Question6({ nextQuestion, previousQuestion, updateChoices, choices }) {
    const [apiKey, setApiKey] = useState(choices.apiKey || '');

    const handleInputChange = (event) => {
        setApiKey(event.target.value);
        updateChoices({ apiKey: event.target.value });
    };

    return (
        <div className='q1div'>
            {/*<h1 className='q1text'>API Key:</h1>
            <input className='apiinput' value={apiKey} onChange={handleInputChange} />*/}
        </div>
    );
}

// Add more question components as needed...

// Array of question components
const questions = [
    <Question1 key="1" />,
    <Question2 key="2" />,
    <Question3 key="3" />,
    <Question4 key="4" />,
    <Question5 key="5" />,
    <Question6 key="6" />
    // Add more questions here...
];

function QuestionnaireContent() {
    const { progress, setProgress } = useContext(ProgressContext);
    const { choices, setChoices } = useContext(DataContext);

    const nextQuestion = () => {
        setProgress((prevProgress) => Math.min(prevProgress + 20, 100)); // Increment progress
    };

    const previousQuestion = () => {
        setProgress((prevProgress) => Math.max(prevProgress - 20, 0)); // Decrement progress
    };

    const updateChoices = (newChoices) => {
        setChoices((prevChoices) => ({
            ...prevChoices,
            ...newChoices
        }));
    };

    // Calculate current question index
    const currentQuestionIndex = progress / 20;
    const CurrentQuestionComponent = questions[currentQuestionIndex];

    return (
        <>
            {React.cloneElement(CurrentQuestionComponent, { nextQuestion, previousQuestion, updateChoices, choices })}
        </>
    );
}

export default QuestionnaireContent;