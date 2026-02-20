import React from "react";
import "../styles/footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <h2>TripMate</h2>
          <p>Travel Smart, Travel Together.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Menu</h4>
            <a href="/">Home</a>
            <a href="/explore">Explore</a>
            <a href="/community">Community</a>
            <a href="/mytrip">My Trip</a>
          </div>

          <div>
            <h4>Support</h4>
            <a href="#">FAQ</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>

        <div className="footer-social">
          <h4>Follow</h4>
          <div className="social-icons">
            <span>🌎</span>
            <span>📷</span>
            <span>✈️</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} TripMate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
