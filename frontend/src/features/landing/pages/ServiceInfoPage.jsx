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
          <div className="bg-gradient-to-br from-primary-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 px-8 py-12 md:py-20 text-center border-b border-primary-100 dark:border-slate-800">
            <div className="text-7xl mb-8 transform hover:scale-110 transition-transform duration-300 pointer-events-none">
              <div className="inline-block bg-white dark:bg-slate-950 p-8 rounded-full shadow-2xl border-4 border-primary-50 dark:border-slate-800">
                {service.icon}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">{service.title}</h1>
            <p className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-semibold italic">{service.subtitle}</p>
          </div>

          {/* Content Body */}
          <div className="p-8 md:p-16">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Professional Overview</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
              {service.description}
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">What we provide</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-16">
              {service.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-900 transition-all group">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="text-green-600 dark:text-green-400 shrink-0" size={24} />
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-bold">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Process Section */}
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Our Process</h2>
            <div className="relative border-l-2 border-primary-100 dark:border-slate-800 ml-4 space-y-10 mb-16">
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Step 1: Consultation</h4>
                <p className="text-gray-500 dark:text-gray-400">Initial meeting to discuss your pet's health history and current concerns.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Step 2: Diagnosis</h4>
                <p className="text-gray-500 dark:text-gray-400">We perform necessary tests using state-of-the-art equipment to pin-point issues.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Step 3: Treatment Plan</h4>
                <p className="text-gray-500 dark:text-gray-400">A detailed plan is created and discussed with you for the best recovery path.</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Common Questions</h2>
              <div className="space-y-4">
                <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">How long does the procedure take?</h4>
                  <p className="text-sm text-gray-500">Most specialized services take between 1-3 hours, but we will provide a specific estimate during consultation.</p>
                </div>
                <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Is there a recovery period?</h4>
                  <p className="text-sm text-gray-500">Yes, recovery depends on the service type. We provide full at-home care instructions for every case.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center p-10 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-2">Book Your Visit Today</h3>
              <p className="opacity-90 mb-8 max-w-md mx-auto italic">"Because your pets deserve the gold standard in veterinary care."</p>
              <button onClick={() => navigate('/register')} className="bg-white text-primary-600 py-4 px-10 rounded-full font-bold text-lg shadow-lg hover:bg-opacity-90 hover:scale-105 transition-all">
                Schedule Appointment Now
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
