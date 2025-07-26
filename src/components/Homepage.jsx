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
  X,
  HelpCircle
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
    { number: "69.13%", label: "of total schools in India are government schools" },
    { number: "54%", label: "of the total student population in the country study in government schools" },
    { number: "44.8%", label: "of Grade V students in government schools can read Grade 2-level texts" }
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
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Rooted in Classrooms. Powered by Code.
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Empowering educators in underserved Indian classrooms and equipping them to create personalised, English Language learning experiences aligned with India's Foundational Literacy and Numeracy Framework for multilevel learners in single-teacher classrooms.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-yellow-100">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Personalised Learning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Adapting content to each learner's level (reading, writing, speaking and listening) through a curated database of successfully tested, classroom-ready prototypes.
                </p>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Empowered Teaching
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Providing easy-to-navigate tools that save time and improve lesson quality - enabling educators to make learning more meaningful, relevant, and responsive to every child.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leader. Innovator. Believer.
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-8 md:p-12 border border-yellow-100">
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                I believe in the power of stories to transform learning. One word at a time. One student at a time.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Hi! My name is Samaya M. Bery, and I am a 17-year-old, Grade 12 student at The Shri Ram School Moulsari. An avid reader, I express myself through writing poetry, classical dance and building meaningful connections with the world around me.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                My vision is to build beyond myself, to reimagine what learning can look like for every child, and to create a future where education is not bound by infrastructure, but powered by intention.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                My journey in education began not in a classroom but in a conversation with an enthusiastic 10-year-old who had a mind full of ideas but struggled to articulate them fluently in English. Limited resources and a lack of personalised learning impede quality education for a majority of underprivileged students in India. This sparked the beginning of a reading program.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Batton Batton Mein came into being in March 2023 for Grade 4 and 5 government school students. My initiative supports India's Foundational Literacy and Numeracy (FLN) framework by developing customised lesson plans that nurture both verbal and non-verbal expression. I began by mentoring a focus group of 10 high-level Grade 5 learners and expanded to a multilevel classroom setting of 40 Grade 4 students. But as the classroom grew, so did the challenge: the need for differentiated, level-appropriate content. I realised scaling personalised learning would require more than passion; it would necessitate a tool.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                To scale impact and enhance accessibility, I learnt JavaScript and developed iLesson, an AI-powered web app that helps educators, both teachers and volunteers, seamlessly access a database of curated, adaptive lesson plans tailored to their students' specific learning pace and skill level. This tool alleviates the burden on educators while ensuring equitable, high-quality education in resource-limited schools. By integrating AI-driven customisation, I aim to bridge the educational divide and make joyful, personalised learning accessible to every child.
              </p>
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

      {/* Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center group"
          onClick={() => alert('Help functionality coming soon!')}
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-1 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-2">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">iLesson</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md mx-auto">
                Empowering teachers to create personalized, inclusive learning experiences 
                for underprivileged children worldwide.
              </p>
              <p className="text-sm text-gray-400">
                Rooted in Classrooms. Powered by Code.
              </p>
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