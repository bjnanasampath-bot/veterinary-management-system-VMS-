import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './LandingPage.css';

export default function LandingPage() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/client-portal');
    }
  };

  return (
    <div className="landing-container">
      {/* Navbar section */}
      <nav className="landing-navbar">
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="navbar-logo"
          style={{ textDecoration: 'none' }}
        >
          <div className="logo-icon">🐾</div>
          <span className="brand-name">VetCare</span>
        </Link>

        <div className="navbar-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about-us" className="nav-link">About Us</a>
          <a href="#services" className="nav-link">Services</a>
          {isAuthenticated && <Link to="/settings" className="nav-link">Settings</Link>}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-dashboard">Dashboard</Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/client-portal" className="btn-register">Signup / Register</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section" id="home">
        <div className="hero-content">
          <h1 className="hero-title">Premium Veterinary Care for Your Best Friends</h1>
          <p className="hero-subtitle">
            Providing compassionate and state-of-the-art medical services to keep your pets happy, healthy, and thriving.
          </p>
          <div className="hero-cta">
            <button className="cta-button" onClick={handleGetStarted}>
              Get Started
            </button>
            <a href="#services" className="secondary-button">
              Our Services
            </a>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="decorative-blob"></div>
          {/* Using a solid nice graphic illustration placeholder instead of broken image */}
          <div className="hero-graphic">
             <div className="paw-large">🐾</div>
          </div>
        </div>
      </main>

      {/* About Us Section */}
      <section className="info-section" id="about-us">
        <div className="section-header">
          <h2>About Us</h2>
          <p>Learn more about our mission and the team that cares for your pets.</p>
        </div>
        <div className="about-grid">
          <div className="about-card">
            <h3>Experienced Team</h3>
            <p>Our veterinarians bring decades of experience and specialized knowledge to every consult.</p>
          </div>
          <div className="about-card">
            <h3>Modern Facility</h3>
            <p>Equipped with the latest diagnostic and surgical tools, our clinic is built for pet comfort and safety.</p>
          </div>
          <div className="about-card">
            <h3>Compassionate Care</h3>
            <p>We treat every patient as part of our own family, ensuring love and gentle handling.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="info-section services-section" id="services">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Comprehensive veterinary solutions for your pets.</p>
        </div>
        <div className="services-grid">
          <div className="service-item" onClick={() => navigate('/services/routine-checkups')}>
             <div className="service-icon">🩺</div>
             <h4>Routine Checkups</h4>
             <p className="service-desc">Comprehensive physical exams to ensure your pet's overall health and early detection of issues.</p>
          </div>
          <div className="service-item" onClick={() => navigate('/services/vaccinations')}>
             <div className="service-icon">💉</div>
             <h4>Vaccinations</h4>
             <p className="service-desc">Essential immunizations tailored to your pet's lifestyle to protect against common diseases.</p>
          </div>
          <div className="service-item" onClick={() => navigate('/services/orthopedics')}>
             <div className="service-icon">🦴</div>
             <h4>Orthopedics</h4>
             <p className="service-desc">Specialized care for bones and joints, including advanced diagnostics and surgical solutions.</p>
          </div>
          <div className="service-item" onClick={() => navigate('/services/dental-care')}>
             <div className="service-icon">🦷</div>
             <h4>Dental Care</h4>
             <p className="service-desc">Complete oral health services including professional cleanings and preventative care.</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} VetCare Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
