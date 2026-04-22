import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Heart, ArrowRight, Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { fetchSettings } from '../../settings/settingsSlice';
import { logout } from '../../auth/authSlice';
import { settingsApi, contactApi } from '../../../api';
import toast from 'react-hot-toast';
import './LandingPage.css';

export default function LandingPage() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const siteSettings = useSelector((s) => s.settings.data);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      dispatch(logout());
    }
    setTimeout(() => {
      navigate('/client-portal');
    }, 100);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await contactApi.create(contactForm);
      toast.success('Your message has been sent! We will contact you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    { q: "What are your opening hours?", a: "We are open Monday to Friday from 8:00 AM to 8:00 PM, and Saturday/Sunday from 10:00 AM to 4:00 PM. Emergency services are available 24/7." },
    { q: "Do I need an appointment for a routine checkup?", a: "While we recommend booking ahead to minimize wait times, we do accept walk-ins for routine exams depending on availability." },
    { q: "What species do you treat?", a: "We specialize in small animals (dogs, cats, rabbits) and exotic pets (birds, reptiles, hamsters)." },
    { q: "How can I access my pet's medical records?", a: "You can sign up for our Client Portal to view full medical history, lab results, and upcoming vaccinations at any time." }
  ];

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
          <a href="#faq" className="nav-link">FAQ</a>
          <a href="#contact" className="nav-link">Contact</a>
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
          <div className="hero-image-container">
            <img src="/hero_pets.png" alt="Happy pets" className="hero-image-premium" />
            <div className="floating-badge badge-1">
              <span className="badge-icon">⭐</span>
              <div className="badge-text">
                <strong>4.9/5</strong>
                <p>Client Rating</p>
              </div>
            </div>
            <div className="floating-badge badge-2">
              <span className="badge-icon">🩺</span>
              <div className="badge-text">
                <strong>24/7</strong>
                <p>Expert Care</p>
              </div>
            </div>
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
          <div className="about-image-side h-[400px] overflow-hidden rounded-3xl shadow-2xl relative">
            <img 
              src="/about_us_caring.png" 
              alt="Veterinarian caring for pets" 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
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

      {/* FAQ Section */}
      <section className="info-section premium-border" id="faq">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about our clinic and services.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item card p-0 overflow-hidden cursor-pointer" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
              <div className="p-5 flex items-center justify-between">
                <span className="font-bold text-gray-800 dark:text-white capitalize">{faq.q}</span>
                {activeFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {activeFaq === i && (
                <div className="px-5 pb-5 text-gray-500 dark:text-gray-400 text-sm animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="info-section contact-section" id="contact">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <p>Have questions? We're here to help you and your pet.</p>
        </div>
        <div className="contact-grid">
          <div className="contact-info-cards">
            <div className="contact-info-card">
              <Mail className="text-primary-600" />
              <div>
                <h4>Email Us</h4>
                <p>support@vetcare.com</p>
              </div>
            </div>
            <div className="contact-info-card">
              <Phone className="text-primary-600" />
              <div>
                <h4>Call Us</h4>
                <p>+1 (555) 000-0000</p>
              </div>
            </div>
            <div className="contact-info-card">
              <MapPin className="text-primary-600" />
              <div>
                <h4>Visit Us</h4>
                <p>123 Pet Lane, Animal City</p>
              </div>
            </div>
          </div>

          <form className="contact-form card" onSubmit={handleContactSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Name" 
                required 
                className="input-field"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="Email" 
                required 
                className="input-field"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              />
            </div>
            <input 
              type="text" 
              placeholder="Subject" 
              required 
              className="input-field mb-4"
              value={contactForm.subject}
              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
            />
            <textarea 
              placeholder="Message" 
              required 
              rows="4" 
              className="input-field mb-4"
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
            />
            <button type="submit" disabled={submitting} className="cta-button w-full shadow-lg">
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} {siteSettings.app_footer_text || 'VetCare Management System. All rights reserved.'}</p>
      </footer>
    </div>
  );
}
