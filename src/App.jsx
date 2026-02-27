import { createContext, useEffect, useState } from "react";
import AuthProvider from "./context/AuthContext";
import TripProvider from "./context/TripContext";
import { getTravelSpots } from "./api/travelApi";
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Explore from './pages/Explore.jsx'
import Mytrip from './pages/Mytrip.jsx'
import Profile from './pages/Profile.jsx'
import Community from './pages/Community.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx"
import ExploreDetail from './components/ExploreDetail.jsx'
import Loading from "./components/Loading";


import './App.scss'

export const TravelContext = createContext({
  places: [],
  loading: true,
});

function App() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      const data = await getTravelSpots();
      console.log(data)
      setPlaces(data);
      setLoading(false);
    };

    fetchSpots();
  }, []);




  if (loading) return <Loading />;
  return (
    <AuthProvider>
      <TripProvider>
        <TravelContext.Provider value={{ places, loading }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/detail" element={<ExploreDetail />} />
            <Route path="/mytrip" element={<Mytrip />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
          <Footer />
        </TravelContext.Provider>
      </TripProvider>
    </AuthProvider>
  )
}

export default App
