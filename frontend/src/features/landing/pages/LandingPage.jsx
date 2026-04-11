import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, Heart, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { settingsApi } from '../../../api';
import './LandingPage.css';

export default function LandingPage() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState({});

  useEffect(() => {
    settingsApi.getAll().then(res => {
      const data = res.data?.results || res.data?.data || res.data || [];
      const settingsMap = {};
      data.forEach(s => settingsMap[s.key] = s.value);
      setSiteSettings(settingsMap);
    }).catch(err => console.error("Failed to load settings", err));
  }, []);

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
          to="/"
          className="navbar-logo"
          style={{ textDecoration: 'none' }}
        >
          <div className="logo-icon">🐾</div>
          <span className="brand-name">{siteSettings.app_logo_name || 'VetCare'}</span>
        </Link>

        <div className="navbar-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about-us" className="nav-link">About Us</a>
          <a href="#services" className="nav-link">Services</a>
          {isAuthenticated && <Link to="/settings" className="nav-link">Settings</Link>}
        </div>

        <div className="navbar-actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
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
          <h1 className="hero-title">{siteSettings.landing_hero_title || 'Premium Veterinary Care for Your Best Friends'}</h1>
          <p className="hero-subtitle">
            {siteSettings.landing_hero_subtitle || 'Providing compassionate and state-of-the-art medical services to keep your pets happy, healthy, and thriving.'}
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
      <section className="info-section premium-border" id="about-us">
        <div className="section-header">
          <h2>{siteSettings.landing_about_title || 'About Us'}</h2>
          <p>{siteSettings.landing_about_description || 'Learn more about our mission and the team that cares for your pets.'}</p>
        </div>
        
        <div className="about-hero-block">
          <div className="about-image-side video-container h-[400px] overflow-hidden rounded-3xl shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/5P3fP2L9AOk?autoplay=1&mute=1&loop=1&playlist=5P3fP2L9AOk&controls=0&modestbranding=1" 
              title="Healthy Pets and Veterinary Care" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              style={{ objectFit: 'cover' }}
            ></iframe>
          </div>
          <div className="about-text-side">
            <h3 className="text-3xl font-bold mb-4">Dedicated to Excellence</h3>
            <p className="mb-6 opacity-80">Our clinic is recognized as a leader in veterinary medicine, combining years of expertise with genuine love for animals. We believe in providing transparency, comfort, and state-of-the-art diagnostics for every pet.</p>
            <div className="about-grid-mini">
              <div className="about-card-mini">
                <Users size={20} className="text-primary-600 mb-2"/>
                <h4 className="font-bold text-sm">Expert Doctors</h4>
              </div>
              <div className="about-card-mini">
                <Heart size={20} className="text-red-500 mb-2"/>
                <h4 className="font-bold text-sm">Kind Care</h4>
              </div>
            </div>
            <button onClick={() => navigate('/about-us')} className="cta-button mt-8 shadow-md">
               Learn Full Story
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="info-section services-section" id="services">
        <div className="section-header">
          <h2>{siteSettings.landing_services_title || 'Our Services'}</h2>
          <p>{siteSettings.landing_services_description || 'Comprehensive veterinary solutions for your pets.'}</p>
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
        <p>&copy; {new Date().getFullYear()} {siteSettings.app_footer_text || 'VetCare Management System. All rights reserved.'}</p>
      </footer>
    </div>
  );
}
