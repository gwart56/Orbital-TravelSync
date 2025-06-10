import Header from "../components/Header";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SignUpPage() {
    const [errorMsg, setError] = useState(''); //initialise to no errors
    const [successfulMsg, setSuccessful] = useState(''); //initialise to no successful

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

        const { error } = await supabase.auth.signUp({ //handles sign up
            email: formdata.email,
            password: formdata.password,
            options: { formdata: { name: formdata.name } }, //send extra info about the name
        })

        if (error) {
            setError(error.message);
            setSuccessful('');
        } else {
            setSuccessful('Signup successful! Check email to confirm.');
            setError('');
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

                    <button type="submit" className="btn btn-success mt-3">Submit</button>
                </form>
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
        </>
    );
}
