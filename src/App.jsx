import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Questionnaire from './Questionnaire';
import SignUp from './SignUp';
import './App.css'; 
import SignIn from './SignIn';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><Questionnaire /></Layout>} />
                <Route path="/signup" element={<Layout><SignUp /></Layout>} />
                <Route path="/signin" element={<Layout><SignIn/></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;