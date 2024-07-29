import { useContext, useState } from 'react';
import { ProgressContext } from './Questionnaire';
import { DataContext } from './Questionnaire';

function ProgressBarButton() {
    const { progress, setProgress } = useContext(ProgressContext);
    const { choices } = useContext(DataContext);
    const [workoutRoutine, setWorkoutRoutine] = useState([]);
    const [error, setError] = useState(null);

    const handleGenerateRoutine = async () => {
        try {
            const response = await fetch('http://localhost:5000/generate-workout-routine', {
                method: 'POST',
                body: JSON.stringify(choices),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate workout routine');
            }
            const data = await response.json();
            const content = data.choices[0].message.content;

            try {
                // Attempt to parse the response as JSON
                const parsedContent = JSON.parse(content);
                setWorkoutRoutine(parsedContent);
                setError(null);
            } catch (jsonError) {
                // If JSON parsing fails, manually parse the response
                const routine = parseWorkoutContent(content);
                setWorkoutRoutine(routine);
                setError(null);
            }
        } catch (error) {
            console.error('Error generating workout routine:', error.message);
            setError(error.message);
        }
    };

    const parseWorkoutContent = (content) => {
        const lines = content.split('\n');
        const routine = {};
        let currentDay = null;

        lines.forEach(line => {
            const dayMatch = line.match(/"day(\d+)"/);
            if (dayMatch) {
                currentDay = `day${dayMatch[1]}`;
                routine[currentDay] = [];
            } else if (currentDay) {
                const exerciseMatch = line.match(/{"exercise": "(.*)", "sets": (\d+), "reps": "(.*)"}/);
                if (exerciseMatch) {
                    routine[currentDay].push({
                        exercise: exerciseMatch[1],
                        sets: exerciseMatch[2],
                        reps: exerciseMatch[3]
                    });
                }
            }
        });

        return routine;
    };

    const handleButtonProgress = () => {
        if (progress < 100) {
            setProgress(progress + 20);
        }
    };

    const handleButtonBack = () => {
        if (progress !== 0) {
            setProgress(p => p - 20);
        }
    };

    const handleButtonComplete = async () => {
        console.log({ choices });
        await handleGenerateRoutine();
        console.log({workoutRoutine});
    };

    const renderWorkoutDay = (day, exercises) => (
        <div className = 'workoutbox' key={day}>
            <h3>{day}</h3>
            {exercises.map((exercise, index) => (
                <div key={index}>
                    <p><strong>{exercise.exercise}</strong></p>
                    <p>Sets: {exercise.sets}</p>
                    <p>Reps: {exercise.reps}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className='progress-buttons-container'>
            {progress !== 0 && progress!==100 && (
                <button className='progress-button' onClick={handleButtonBack}>Back</button>
            )}
            {progress < 100 && progress !== 40 && progress !== 80 && progress !==0 &&(
                <button className='progress-button' onClick={handleButtonProgress}>Progress</button>
            )}
                {progress === 100 && (
                    <>
                        <div className='complete-container'>
                            <div className='workouts-container'>
                                {error && (
                                    <div className='error-message'>
                                        <pre>{error}</pre>
                                    </div>
                                )}
                                {Object.keys(workoutRoutine).length > 0 && !error && (
                                    <div className='workout-routine'>
                                        {Object.entries(workoutRoutine).map(([day, exercises]) =>
                                            renderWorkoutDay(day, exercises)
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className='button-holder'>
                                <button className='progress-button' onClick={handleButtonBack}>Back</button>
                                <button className='progress-button' onClick={handleButtonComplete}>Generate</button>
                            </div>
                        </div>
                    </>
                )}
        </div>
    );
}

export default ProgressBarButton;