import Header from "../components/Header";
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from "../lib/AuthContext";
import './LoginPage.css';

function SignUpContent() {
    const [errorMsg, setError] = useState(''); //initialise to no errors
    const [successfulMsg, setSuccessful] = useState(''); //initialise to no successful
    const {signUpNewUser} = useAuthContext();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccessful('Please wait...');
        const formData = new FormData(e.target);
        const formdata = Object.fromEntries(formData.entries()); //convert into Object entries from formData
        console.log(formdata);
        console.log('Trying to sign up '+ formdata.name + "..., email: " + formdata.email);

        if (formdata.password != formdata.confirmPassword) {
            setError('Passwords must match!');
            setSuccessful('');
            return;
        }

        // const { error } = await supabase.auth.signUp({ //handles sign up
        //     email: formdata.email,
        //     password: formdata.password,
        //     options: { formdata: { name: formdata.name } }, //send extra info about the name
        // })

        try {
            const result = await signUpNewUser(formdata.email, formdata.password, formdata.name);
            if (!result.success) {
                setError(result.error);
                setSuccessful('');
            } else {
                setSuccessful('Signup successful! Check email to confirm.');
                setError('');
            }
        } catch (error) {
            setError(error.message);
            setSuccessful('');
            console.error("ERROR: ", error);
        }
    };

    return (
        <div className="login-form-container">
            <h1 className="text-primary" style={{marginBottom: "20px", marginTop: "100px"}}>Welcome to TravelSync</h1>
            <p className="lead">Plan your group trips easily.</p>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" className="form-label mt-3">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                        required
                    />

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

                    <label htmlFor="confirm-password" className="form-label mt-3">Confirm Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Confirm Password"
                        required
                    />

                    <button type="submit" className="btn btn-success mt-3" style={{margin: "20px"}}>Sign Up</button>
                </form>
                <Link to="/login">Already hv account? Login</Link>
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

export default function SignUpPage() {
    return (<>
        <Header />
        <div className="login-container">
            <div className="login-image-container">
                <img 
                    style={{backgroundAttachment: "fixed"}}
                    src="https://images.unsplash.com/photo-1625472331999-03e8bd352473?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="kamikochi scenery"
                    className="login-image"
                />
            </div>
            <SignUpContent /> {/*class: login-form-container*/}
        </div>
    </>)
}