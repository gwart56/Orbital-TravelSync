import Header from "../components/Header";
import { useState } from "react";

export default function SignUpPage() {
    const [error, setError] = useState(''); //initialise to no errors
    const [successful, setSuccessful] = useState(''); //initialise to no successful
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Signup failed');
                setSuccessful('');
                return;
            }

            // alert('Signup successful!');
            console.log('User:', data.user);
            setSuccessful('Signup successful!');
            setError('');
            // Redirect or save token if needed
        } catch (error) {
            console.error('Error during signup:', error);
            setError('An error occurred. Please try again.');
            // alert('An error occurred. Please try again.');
            setSuccessful('');
        }
    };

    return (
        <>
            <Header />
            <h1 className="text-primary">Welcome to TravelSync</h1>
            <p className="lead">Plan your group trips easily.</p>
            <div style={{ maxWidth: "70%", margin: "0 auto" }}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" className="form-label mt-3">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email" className="form-label mt-3">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={formState.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password" className="form-label mt-3">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        placeholder="Password"
                        value={formState.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" className="btn btn-success mt-3">Submit</button>
                </form>
                {error && ( //DISPLAY ERROR MSG
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                    )}
                {successful && ( //DISPLAY SUCCESS MSG
                    <div className="alert alert-success mt-3" role="alert">
                        {successful}
                    </div>
                    )}
            </div>
        </>
    );
}
