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
        <div className="text-center text-white mb-3 pt-4 fade-in-up">
          <h1 className="fw-bold display-4" style={{ color: '#007BFF' }}>TravelSync</h1>
          <h5 className="text-light">Syncing Group Travel, One Trip At A Time</h5>
        </div>

        {/* Mission Statement */}
        <div className="row justify-content-center mb-5 fade-in-up">
          <div className="col-md-8">
            <p className="fs-5 text-white bg-dark bg-opacity-50 p-4 rounded shadow">
              Planning a trip with friends or family should be fun - not frustrating.
              At <strong>TravelSync</strong>, we're on a mission to transform chaotic travel planning into a seamless, collaborative experience.
            </p>
          </div>
        </div>

        {/* Pain Points Section */}
        <div className="d-flex justify-content-center mt-2 mb-4 fade-in-up">
          <div className="card shadow-lg rounded-4 p-4 bg-light bg-opacity-75" style={{ maxWidth: '720px', width: '100%' }}>
            <div className="card-body text-center">
              <h4 className="fw-semibold mb-4">We've been there - planning travel can be a pain.</h4>

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
          <h2 className="text-white text-center mx-auto mb-4 px-4 py-2 rounded-3 bg-dark bg-opacity-50 d-inline-block">
            Our Core Features
          </h2>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {[
              { title: 'Smart Hotel Booking', desc: 'Aggregate prices and locations from top sites', color: '#2ECC71' },
              { title: 'Shared Itineraries', desc: 'Add activities and sync plans in real-time', color: '#3498DB' },
              { title: 'Expense Splitting', desc: 'Split costs fairly in any currency', color: '#F1C40F' },
              { title: 'Interactive Maps', desc: 'See hotels and attractions visually', color: '#9B59B6' }
            ].map((feature, i) => (
              <div className="col" key={i}>
                <div
                  className="glass-card text-white p-4 h-100 d-flex flex-column justify-content-center align-items-start rounded-4 shadow"
                  style={{
                    borderLeft: `6px solid ${feature.color}`,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(6px)'
                  }}
                >
                  <h5 className="fw-bold mb-2" style={{ color: feature.color }}>
                    ✅ {feature.title}
                  </h5>
                  <p className="mb-0 text-white">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Team Section */}
        <div className="text-center mb-5">
          <h2 className="text-white bg-dark bg-opacity-50 px-4 py-2 rounded d-inline-block">
            Meet the Team
          </h2>
          <p className="text-white bg-dark bg-opacity-50 px-4 py-3 rounded d-inline-block mt-3">
            We're <strong>TravelSync</strong>, a team of developers and travel enthusiasts building tools to make group trips <strong>smoother</strong>. 
            We aim to launch your travel plans to <strong>new heights</strong>.
          </p>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <button
            className="cta-glass-button shadow-lg mx-auto d-block"
            onClick={handleClick}
          >
            🚀 Start Planning Your Adventure!
          </button>

          <p className="cta-slogan mx-auto">
            ✨ Sync Your Plans. Travel in Sync. ✨
          </p>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;
