
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import { AuthContextProvider, useAuthContext } from './lib/AuthContext';
import AboutPage from './pages/AboutPage';
import ActivityPage from './pages/ActivityPage';
import { HotelsPage } from './pages/HotelsPage';
import ContactPage from './pages/ContactPage';
import MapPage from './pages/MapPage';
import LocationPicker from './components/GoogleMapsComponents/LocationPicker';
import { SummaryPage } from './pages/SummaryPage';

function AppRoutes() {

  const { session } = useAuthContext(); //user session (determines which page can go to)

  return (
    <>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/dashboard" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/contact" element={<ContactPage/>} />
            <Route path="/map" element={<LocationPicker />}/>

            {/* Protected Route */}
            <Route path="/activities/:id" element={session ? <ActivityPage /> : <Navigate to="/dashboard" />}/>
            <Route path="/hotels/:id" element={session ? <HotelsPage /> : <Navigate to="/dashboard" />}/>
            <Route path="/summary/:id" element={session ? <SummaryPage /> : <Navigate to="/dashboard" />}/>
            
            {/* Default route */}
            <Route path="*" element={<Navigate to={session ? "/dashboard" : "/login"} />} />
          </Routes>
        </Router>
    </>
  );

  // return ( 
  //                <Router>
  //                   <Routes>
  //                       {/* Public Routes */}
  //                       <Route path="/login" element={<LoginPage />} />
  //                       <Route path="/signup" element={<SignUpPage />} />
  //                       {/* Default route */}
  //                       <Route path="/dashboard" element={<Dashboard />}/>
  //                       <Route path="*" element={<Navigate to={"/signup"} />} />
  //                   </Routes>
  //               </Router>
  //       );
}

function App() {
  return (
    <AuthContextProvider>
      <AppRoutes />
    </AuthContextProvider>
  );
}

export default App
