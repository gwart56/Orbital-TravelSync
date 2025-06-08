import Header from "../components/Header";


function signup(formData){
    const [email, password] = formData.values();
    console.log(email);
    console.log(password);
    //TODO--- Implement signing up
}

export default function SignUpPage() {
    return (
        <>
            <Header />
            <h1 className="text-primary">Welcome to TravelSync</h1>
            <p className="lead">Plan your group trips easily.</p>
            <div style={{maxWidth: "70%", margin: "0 auto"}}>
                <form action={signup}>
                    <label htmlFor="email" className="form-label mt-3">Email:</label>
                    <input type="email" id="email" name="email" className="form-control" placeholder="you@example.com" autoComplete="username" required/>
                    <label htmlFor="password" className="form-label mt-3">Password:</label>
                    <input type="password" id="password" name="password" className="form-control" placeholder="Password" autoComplete="new-password" required/>
                    <button className="btn btn-success mt-3">Submit</button>
                </form>
            </div>
        </>
    );
}