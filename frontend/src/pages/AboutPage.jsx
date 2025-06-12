import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function AboutPage()  {
  const navigate = useNavigate();

  function handleClick() {
    navigate('/dashboard');//send to dashboard
  }

  const backgroundStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1625472331999-03e8bd352473?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
  };

  //text-white bg-secondary bg-opacity-50 <---- for white text with transparent grey background

  return (
    <div style={backgroundStyle}>
    <Header />
    <div className="container my-5">
      {/* Hero Section */}
      <div className="row text-center mb-5">
        <div className="col" style={{marginTop: "50px"}}>
          <h1 className="display-4 fw-bold text-primary">TravelSync</h1>
          <p className="lead">Syncing Group Travel, One Trip At A Time</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-md-8 mx-auto text-center">
          <p className="fs-5 text-white bg-secondary bg-opacity-50">
            Planning a trip with friends or family should be fun—not frustrating. At <span className="fw-bold">TravelSync</span>, 
            we're on a mission to transform chaotic travel planning into a seamless, collaborative experience.
          </p>
        </div>
      </div>

      {/* Why Section */}
      <div className="row mb-5">
        <div className="col">
          <h2 className="text-center mb-4 text-white bg-secondary bg-opacity-50">Why We Built TravelSync</h2>
          <div className="card shadow-sm">
            <div className="card-body">
              <p>As travelers ourselves, we've felt the pain of:</p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Juggling endless browser tabs for hotel prices</li>
                <li className="list-group-item">Struggling to align schedules with friends</li>
                <li className="list-group-item">Awkwardly splitting expenses after the trip</li>
              </ul>
              <p className="mt-3">TravelSync solves these with:</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <span className="badge bg-primary">Compare hotels</span>
                <span className="badge bg-primary">Plan collaboratively</span>
                <span className="badge bg-primary">Track expenses</span>
                <span className="badge bg-primary">Visualize trips</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="row mb-5">
        <div className="col">
          <h2 className="text-center mb-4 text-white bg-secondary bg-opacity-50">Our Core Features</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div className="col">
              <div className="card h-100 shadow-sm bg-info bg-opacity-75 text-white">
                <div className="card-body">
                  <h5 className="card-title">✅ Smart Hotel Booking</h5>
                  <p className="card-text">Aggregate prices and locations from top sites</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow-sm bg-info bg-opacity-75 text-white">
                <div className="card-body">
                  <h5 className="card-title">✅ Shared Itineraries</h5>
                  <p className="card-text">Add activities and sync plans in real-time</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow-sm bg-info bg-opacity-75 text-white">
                <div className="card-body">
                  <h5 className="card-title">✅ Expense Splitting</h5>
                  <p className="card-text">Split costs fairly in any currency</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card h-100 shadow-sm bg-info bg-opacity-75 text-white">
                <div className="card-body">
                  <h5 className="card-title">✅ Interactive Maps</h5>
                  <p className="card-text">See hotels and attractions visually</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team CTA */}
      <div className="row text-center mb-4">
        <div className="col">
          <h2 className="text-white bg-secondary bg-opacity-50">Meet the Team</h2>
          <p className="text-white bg-secondary bg-opacity-50">
            We're <strong>TravelSync</strong>, a team of developers and travel enthusiasts building tools to make group trips smoother. 
            As part of our Orbital Project level Apollo 11, we aim to launch your travel plans to new heights.
          </p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="row text-center">
        <div className="col">
          <button className="btn btn-primary btn-lg px-4" onClick={handleClick}>
            Start Planning Your Adventure
          </button>
          <p className="mt-3 text-white bg-secondary bg-opacity-75">
            Sync Your Plans. Travel in Sync.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutPage;
