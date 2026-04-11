import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Heart, Shield, Users, Clock, MapPin, Phone } from 'lucide-react';
import './LandingPage.css';

export default function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Mini Navbar */}
      <nav className="landing-navbar" style={{ position: 'relative', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">🐾</div>
          <span className="brand-name">VetCare</span>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section of About Us */}
        <section className="text-center mb-20 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Our Mission & Vision</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            At VetCare, we believe every pet deserves a life full of health, happiness, and vitality. Our journey started with a simple vision: to bridge the gap between advanced medical technology and compassionate, personalized care.
          </p>
        </section>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] bg-black">
            <iframe 
               src="https://player.vimeo.com/video/117934677?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1" 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               allow="autoplay; fullscreen" 
               allowFullScreen
            ></iframe>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Why Choose VetCare?</h2>
            
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl h-fit"><Heart size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Unmatched Compassion</h4>
                <p className="text-gray-500 text-sm">We don't just treat animals; we care for family members. Our bedside manner is legendary for being gentle and understanding.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl h-fit"><Award size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Certified Excellence</h4>
                <p className="text-gray-500 text-sm">Our facility is accredited by leading veterinary associations, meeting the highest standards in the industry.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl h-fit"><Shield size={24} /></div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Transparent Pricing</h4>
                <p className="text-gray-500 text-sm">No hidden fees or surprise costs. We provide detailed estimates and discuss all options with you upfront.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="bg-primary-600 rounded-3xl p-12 text-white text-center mb-24 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-primary-100 text-sm">Happy Pets</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-primary-100 text-sm">Expert Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10</div>
              <div className="text-primary-100 text-sm">Modern Labs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-100 text-sm">Support</div>
            </div>
          </div>
        </section>

        {/* Location & Contact */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-gray-50 dark:bg-slate-800 rounded-2xl text-center border border-gray-100 dark:border-slate-700">
             <div className="inline-block p-4 bg-white dark:bg-slate-900 rounded-full mb-4 shadow-sm text-primary-600"><MapPin size={24}/></div>
             <h4 className="font-bold mb-2 dark:text-white">Visit Us</h4>
             <p className="text-gray-500 dark:text-gray-400 text-sm">123 Veterinary St, Pet City,<br/>Medical District, PC 56789</p>
          </div>
          <div className="p-8 bg-gray-50 dark:bg-slate-800 rounded-2xl text-center border border-gray-100 dark:border-slate-700">
             <div className="inline-block p-4 bg-white dark:bg-slate-900 rounded-full mb-4 shadow-sm text-primary-600"><Phone size={24}/></div>
             <h4 className="font-bold mb-2 dark:text-white">Call Us</h4>
             <p className="text-gray-500 dark:text-gray-400 text-sm">+1 (555) 123-4567<br/>+1 (555) 987-6543</p>
          </div>
          <div className="p-8 bg-gray-50 dark:bg-slate-800 rounded-2xl text-center border border-gray-100 dark:border-slate-700">
             <div className="inline-block p-4 bg-white dark:bg-slate-900 rounded-full mb-4 shadow-sm text-primary-600"><Clock size={24}/></div>
             <h4 className="font-bold mb-2 dark:text-white">Business Hours</h4>
             <p className="text-gray-500 dark:text-gray-400 text-sm">Mon - Fri: 8:00 AM - 8:00 PM<br/>Sat - Sun: 9:00 AM - 5:00 PM</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer py-12 border-t border-gray-100 dark:border-slate-800">
         <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} VetCare Management System. Premium Care for Every Patient.</p>
      </footer>
    </div>
  );
}
