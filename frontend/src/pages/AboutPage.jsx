import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../pages/AboutPage.css';

function AboutPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="about-background">
      <Header />
      
      <div className="about-wrapper py-5">
        {/* Hero Title and Tagline */}
        <div className="text-center text-white mb-3 pt-4">
          <h1 className="fw-bold display-4" style={{ color: '#007BFF' }}>TravelSync</h1>
          <h5 className="text-light">Syncing Group Travel, One Trip At A Time</h5>
        </div>

        {/* Mission Statement */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <p className="fs-5 text-white bg-dark bg-opacity-50 p-4 rounded shadow">
              Planning a trip with friends or family should be fun—not frustrating.
              At <strong>TravelSync</strong>, we're on a mission to transform chaotic travel planning into a seamless, collaborative experience.
            </p>
          </div>
        </div>

        {/* Pain Points Section */}
        <div className="d-flex justify-content-center mt-2 mb-4">
          <div className="card shadow-lg rounded-4 p-4 bg-light bg-opacity-75" style={{ maxWidth: '720px', width: '100%' }}>
            <div className="card-body text-center">
              <h4 className="fw-semibold mb-4">We've been there — planning travel can be a pain.</h4>

              <ul className="list-group list-group-flush fs-5 mb-4">
                <li className="list-group-item border-0 bg-transparent">🔍 Juggling endless tabs for hotel prices</li>
                <li className="list-group-item border-0 bg-transparent">📅 Struggling to align schedules</li>
                <li className="list-group-item border-0 bg-transparent">💸 Awkwardly splitting expenses</li>
              </ul>

              <p className="mb-3 fs-5">TravelSync makes it easier with:</p>

              <div className="d-flex flex-wrap justify-content-center gap-2">
                <span className="badge bg-primary fs-6 px-3 py-2">Compare hotels</span>
                <span className="badge bg-primary fs-6 px-3 py-2">Plan collaboratively</span>
                <span className="badge bg-primary fs-6 px-3 py-2">Track expenses</span>
                <span className="badge bg-primary fs-6 px-3 py-2">Visualize trips</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-5">
          <h2 className="text-center text-white bg-dark bg-opacity-50 py-2 rounded mb-4">Our Core Features</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {[
              { title: 'Smart Hotel Booking', desc: 'Aggregate prices and locations from top sites' },
              { title: 'Shared Itineraries', desc: 'Add activities and sync plans in real-time' },
              { title: 'Expense Splitting', desc: 'Split costs fairly in any currency' },
              { title: 'Interactive Maps', desc: 'See hotels and attractions visually' }
            ].map((feature, i) => (
              <div className="col" key={i}>
                <div className="card h-100 shadow-sm bg-info bg-opacity-75 text-white">
                  <div className="card-body">
                    <h5 className="card-title">✅ {feature.title}</h5>
                    <p className="card-text">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-5">
          <h2 className="text-white bg-dark bg-opacity-50 py-2 rounded">Meet the Team</h2>
          <p className="text-white bg-dark bg-opacity-50 p-3 rounded">
            We're <strong>TravelSync</strong>, a team of developers and travel enthusiasts building tools to make group trips smoother.
            As part of our Orbital Project <em>Apollo 11</em>, we aim to launch your travel plans to new heights.
          </p>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button className="btn btn-lg btn-outline-light px-5 py-2 fw-bold shadow" onClick={handleClick}>
            Start Planning Your Adventure
          </button>
          <p className="mt-4 text-white bg-dark bg-opacity-75 p-3 rounded">
            Sync Your Plans. Travel in Sync.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
