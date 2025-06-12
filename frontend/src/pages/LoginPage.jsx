import Header from "../components/Header";
import { useState } from "react";
import './LoginPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from "../lib/AuthContext";

function LoginPageContent() {
    const [errorMsg, setError] = useState(''); //initialise to no errors
    const [successfulMsg, setSuccessful] = useState(''); //initialise to no successful
    const navigate = useNavigate(); //used for navigation
    const {signInUser} = useAuthContext(); //getting sign in function

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccessful('Please wait...');
        const formData = new FormData(e.target);
        const formdata = Object.fromEntries(formData.entries()); //convert into Object entries from formData
        console.log(formdata);
        console.log('Trying to sign into email: ' + formdata.email);

        try {
            const result = await signInUser(formdata.email, formdata.password);
                if (!result.success) {
                    setError(result.error);
                    setSuccessful('');
                } else {
                    setSuccessful('Successfully Logged In!');
                    setError('');
                    navigate('/dashboard');
                }
        } catch (error) {
            setError(error.message);
            setSuccessful('');
            console.error("ERROR: ", error);
        }
    }

    return (
        <div className="login-form-container">        
            <h1 className="text-primary">Welcome to TravelSync</h1>
            <p className="lead">Sync Your Plans. Travel in Sync.</p>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="form-label mt-3">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="you@example.com"
                        required
                    />

                    <label htmlFor="password" className="form-label mt-3">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        required
                    />

                    <button type="submit" className="btn btn-success mt-3" style={{margin: "20px"}}>Login</button>
                </form>
                <Link to="/signup">Don't have an account? Click here to sign up!</Link>
                {errorMsg && ( //DISPLAY ERROR MSG
                    <div className="alert alert-danger mt-3" role="alert">
                        {errorMsg}
                    </div>
                    )}
                {successfulMsg && ( //DISPLAY SUCCESS MSG
                    <div className="alert alert-success mt-3" role="alert">
                        {successfulMsg}
                    </div>
                    )}
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (<>
        <Header />
        <div className="login-container">
            <LoginPageContent /> {/*class: login-form-container*/}
            <div className="login-image-container">
                <img 
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="Travel illustration"
                    className="login-image"
                />
            </div>
        </div>
    </>)
}