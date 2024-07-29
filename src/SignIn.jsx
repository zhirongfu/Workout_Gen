import { useState } from 'react';
import './css/SignIn.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error logging in');
            }

            // Process the successful response, redirect or store the login data
            console.log('Login successful:', data);
            setSuccess('Sign in successful!');
            setError('');
            // Redirect to another page or update the app state
        } catch (error) {
            setError(error.message);
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="signin-container">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Sign In</button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    );
}

export default SignIn;