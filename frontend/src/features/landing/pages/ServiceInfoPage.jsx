import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import './LandingPage.css'; // Inheriting styling structure

const SERVICES_DATA = {
  'routine-checkups': {
    title: 'Routine Checkups',
    icon: '🩺',
    subtitle: 'Comprehensive Physical Exams for Your Best Friend',
    description: 'Regular wellness exams are the foundation of your pet\'s health care. Dogs and cats age much faster than humans do, so significant changes in health can occur in a short time. Our comprehensive physical exams ensure early detection of potential issues before they become serious.',
    benefits: [
      'Nose-to-tail physical examination',
      'Early disease detection',
      'Weight and nutrition counseling',
      'Behavioral consultation'
    ]
  },
  'vaccinations': {
    title: 'Vaccinations',
    icon: '💉',
    subtitle: 'Essential Immunizations Tailored to Your Pet',
    description: 'Vaccinations are a vital part of preventative care. They protect your pet from highly contagious and potentially fatal diseases. We tailor our vaccination protocols to your pet\'s specific lifestyle, risk factors, and life stage, ensuring they get only the vaccines they truly need.',
    benefits: [
      'Core and non-core vaccines available',
      'Rabies prevention and certification',
      'Customized schedules for puppies and kittens',
      'Titer testing options available'
    ]
  },
  'orthopedics': {
    title: 'Orthopedics',
    icon: '🦴',
    subtitle: 'Advanced Care for Bones and Joints',
    description: 'Whether your pet is suffering from a congenital joint issue like hip dysplasia or has experienced an injury such as a torn ACL, our orthopedic care team provides state-of-the-art diagnostics and surgical solutions to get them back on their feet and pain-free.',
    benefits: [
      'Cranial Cruciate Ligament (CCL) repair',
      'Fracture management and casting',
      'Osteoarthritis pain management',
      'Advanced digital radiography'
    ]
  },
  'dental-care': {
    title: 'Dental Care',
    icon: '🦷',
    subtitle: 'Complete Oral Health Services',
    description: 'Dental disease is one of the most common, yet preventable, health issues in pets. Plaque and tartar buildup can lead to systemic issues affecting the heart, liver, and kidneys. Our professional dental cleanings and preventative care help maintain a healthy, pain-free smile.',
    benefits: [
      'Professional ultrasonic scaling and polishing',
      'Full mouth digital dental X-rays',
      'Safe tooth extractions if necessary',
      'At-home preventative care guidance'
    ]
  }
};

export default function ServiceInfoPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const service = SERVICES_DATA[serviceId];

  if (!service) {
    return (
      <div className="landing-container flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
        <p className="text-gray-500 mb-8">The service you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="landing-container">
      {/* Mini navbar for returning home */}
      <nav className="landing-navbar" style={{ position: 'relative', background: '#fff' }}>
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">🐾</div>
          <span className="brand-name">VetCare</span>
        </div>
        <div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors">
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-primary-50 to-sky-50 px-8 py-12 md:py-16 text-center border-b border-primary-100">
            <div className="text-6xl mb-6 inline-block bg-white p-6 rounded-full shadow-sm">{service.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{service.title}</h1>
            <p className="text-xl text-primary-700 font-medium">{service.subtitle}</p>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              {service.description}
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Benefits & Features</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {service.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <CheckCircle2 className="text-green-500 mt-0.5 shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to schedule an appointment?</h3>
              <p className="text-gray-500 mb-6">Ensure your pet gets the best care possible today.</p>
              <button onClick={() => navigate('/register')} className="btn-primary py-3 px-8 text-lg font-medium shadow-md hover:shadow-lg">
                Book {service.title} Now
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer pb-8 pt-4 bg-transparent border-t-0">
        <p>&copy; {new Date().getFullYear()} VetCare Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
