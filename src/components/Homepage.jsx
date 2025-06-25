import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Target, 
  Heart, 
  Handshake, 
  FileText, 
  Play, 
  CheckCircle,
  ArrowRight,
  GraduationCap,
  PenTool,
  Lightbulb,
  Globe,
  Menu,
  X
} from 'lucide-react';

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Adaptive Learning Levels",
      description: "Create lessons tailored to different reading and writing abilities, ensuring every child can learn at their own pace."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Comprehensive Worksheets",
      description: "Generate printable worksheets that complement your lessons and reinforce learning objectives."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Rich Reading Materials",
      description: "Access curated stories, poems, and educational content appropriate for various skill levels."
    },
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Easy Lesson Planning",
      description: "Streamlined tools that help teachers create structured, engaging lesson plans in minutes."
    }
  ];

  const stats = [
    { number: "70%", label: "Improvement in Reading Skills" },
    { number: "1000+", label: "Teachers Empowered" },
    { number: "50,000+", label: "Students Reached" },
    { number: "85%", label: "Teacher Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">iLesson</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-yellow-600 transition-colors">Features</a>
              <a href="#mission" className="text-gray-600 hover:text-yellow-600 transition-colors">Mission</a>
              <a href="#impact" className="text-gray-600 hover:text-yellow-600 transition-colors">Impact</a>
              <a href="#about" className="text-gray-600 hover:text-yellow-600 transition-colors">About</a>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-yellow-600 transition-colors">Features</a>
                <a href="#mission" className="text-gray-600 hover:text-yellow-600 transition-colors">Mission</a>
                <a href="#impact" className="text-gray-600 hover:text-yellow-600 transition-colors">Impact</a>
                <a href="#about" className="text-gray-600 hover:text-yellow-600 transition-colors">About</a>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 w-fit"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Classroom Background */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{
            backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
              <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="classroom" patternUnits="userSpaceOnUse" width="400" height="300">
                    <rect width="400" height="300" fill="#fef3c7"/>
                    <rect x="50" y="50" width="300" height="200" fill="#fde68a" rx="10"/>
                    <rect x="60" y="60" width="280" height="120" fill="#fcd34d" rx="5"/>
                    <circle cx="80" cy="180" r="15" fill="#f59e0b"/>
                    <circle cx="120" cy="180" r="15" fill="#f59e0b"/>
                    <circle cx="160" cy="180" r="15" fill="#f59e0b"/>
                    <circle cx="200" cy="180" r="15" fill="#f59e0b"/>
                    <rect x="70" y="200" width="20" height="40" fill="#f59e0b"/>
                    <rect x="110" y="200" width="20" height="40" fill="#f59e0b"/>
                    <rect x="150" y="200" width="20" height="40" fill="#f59e0b"/>
                    <rect x="190" y="200" width="20" height="40" fill="#f59e0b"/>
                    <rect x="250" y="80" width="60" height="80" fill="#fbbf24" rx="5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#classroom)"/>
              </svg>
            `)}')`
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-orange-50/90 to-amber-50/90"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Empowering Teachers,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 block">
                Transforming Lives
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              iLesson helps educators create personalized lesson plans and materials for underprivileged children, 
              adapting to different reading and writing levels to ensure every child can learn and thrive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg"
              >
                <span>Start Creating Lessons</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-yellow-400 text-yellow-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-50 hover:border-yellow-500 transition-all duration-200">
                Watch Demo
              </button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2">{stat.number}</div>
                  <div className="text-gray-700 text-sm md:text-base font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bridging the educational gap by providing teachers with tools to create inclusive, 
              level-appropriate learning experiences for every child.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-yellow-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Every Child Deserves Quality Education
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600">
                      <strong>Personalized Learning:</strong> Adapt content to individual reading and writing levels
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600">
                      <strong>Teacher Empowerment:</strong> Simple tools that save time and improve lesson quality
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600">
                      <strong>Inclusive Education:</strong> Ensuring no child is left behind regardless of their starting point
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 text-center border border-yellow-200">
                <Globe className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Global Impact</h4>
                <p className="text-gray-600">
                  Supporting educators worldwide in creating meaningful learning experiences 
                  that transform communities one lesson at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Educators</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create engaging, effective lessons tailored to your students' needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-yellow-100">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3 w-fit mb-4">
                  <div className="text-yellow-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 to-orange-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Classroom?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teachers who are already creating better learning experiences 
            with iLesson's intuitive lesson planning tools.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-yellow-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 inline-flex items-center space-x-2 group shadow-lg"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">iLesson</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Empowering teachers to create personalized, inclusive learning experiences 
                for underprivileged children worldwide.
              </p>
              <p className="text-sm text-gray-400">
                Rooted in Classrooms. Powered by Code.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 iLesson. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 