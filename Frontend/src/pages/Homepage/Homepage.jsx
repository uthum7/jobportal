import React from 'react';
import { Search, Users, FileText, Briefcase, DollarSign, Shield, Target, Code, Database, Brain, Settings, UserCheck } from 'lucide-react';

export default function JobPortalHomepage() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-green-500" />,
      title: "AI-POWERED CV BUILDER",
      description: "Users can create professional resumes efficiently using AI-Oriented ATS A user-friendly form allows input of personal details, education, experience, skills, and summary Previously created resumes can be accessed and updated from the resume dashboard Users can download or share their CV with ease.",
      buttonText: "Create Your Resume",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Search className="w-8 h-8 text-green-500" />,
      title: "JOB SEARCH & APPLICATION",
      description: "Browse job openings through the integrated job portal View detailed job descriptions and required qualifications Apply quickly with the 'Quick Apply' button after creating a jobseeker Profile.",
      buttonText: "Search Jobs",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "FIND & HIRE A MENTOR",
      description: "Consult with industry experts for career guidance and skill development Affordable mentors and view their profiles Hire a mentor by selecting a Hire slot and completing a secure payment Track mentorship sessions through the Mentor Dashboard.",
      buttonText: "Hire A Counselor",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <FileText className="w-8 h-8 text-green-500" />,
      title: "COMMENTING & FEEDBACK SYSTEM",
      description: "Employees can provide constructive feedback to improve candidates Jobseekers can improve their CV based on employer comments.",
      buttonText: "Get Feedback",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "SECURE ACCOUNT MANAGEMENT",
      description: "Users must sign up before accessing platform features Options to view payments, update profiles, and delete accounts.",
      buttonText: "Manage Account",
      buttonColor: "bg-green-500 hover:bg-green-600"
    }
  ];

  const jobCategories = [
    { title: "Accounting & Finance", icon: <DollarSign className="w-8 h-8 text-blue-600" /> },
    { title: "AI Engineer", icon: <Brain className="w-8 h-8 text-purple-600" /> },
    { title: "Full-Stack Developer", icon: <Code className="w-8 h-8 text-green-600" /> },
    { title: "Data Scientist", icon: <Database className="w-8 h-8 text-red-600" /> },
    { title: "DevOps Engineer", icon: <Settings className="w-8 h-8 text-orange-600" /> },
    { title: "QA Engineer", icon: <UserCheck className="w-8 h-8 text-indigo-600" /> },
    { title: "IT Project Manager", icon: <Briefcase className="w-8 h-8 text-teal-600" /> },
    { title: "Deep Learning Engineer", icon: <Brain className="w-8 h-8 text-pink-600" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="relative px-8 py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        {/* Background Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-6xl font-bold mb-6 leading-tight text-white">
              Find a Job & Hire<br />
              <span className="text-green-400">Top Experts</span> on Job Portal
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              Getting hired in a new way. Choose a job and get started right away.
              No need to spend weeks setting up your profile.
            </p>
            
            {/* Search Bar */}
            <div className="flex bg-white rounded-lg shadow-xl max-w-xl">
              <div className="flex-1 flex items-center px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Job title, keywords"
                  className="w-full text-gray-700 outline-none text-sm"
                />
              </div>
              <button className="bg-green-500 text-white px-6 py-2 rounded-r-lg hover:bg-green-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl">
                Find Jobs
              </button>
            </div>
          </div>
          
          {/* Hero Illustration */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Floating Icons */}
              <div className="absolute top-10 left-10 bg-blue-600 p-4 rounded-xl shadow-lg animate-bounce">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-20 right-10 bg-green-500 p-4 rounded-xl shadow-lg animate-pulse">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-20 left-20 bg-purple-600 p-4 rounded-xl shadow-lg animate-bounce">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="absolute bottom-10 right-20 bg-yellow-500 p-4 rounded-xl shadow-lg animate-pulse">
                <Target className="w-8 h-8 text-white" />
              </div>
              
              {/* Central Job Search Badge */}
              <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl border border-gray-200 text-center mx-auto max-w-sm shadow-2xl">
                <div className="text-7xl mb-6">💼</div>
                <div className="text-3xl font-bold text-blue-600 mb-3">JOB SEARCH</div>
                <div className="text-gray-700 text-lg">Find Your Dream Job</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Process Section */}
      <section className="px-8 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gray-800">Features & Process</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our CV Creation & Ranking Web Application is designed to streamline the jobseeking and hiring process by integrating AI-
              powered resume generation, mentorship, job search, and an advanced candidate ranking system.
            </p>
          </div>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start space-x-6">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">{feature.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className={`${feature.buttonColor} text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}>
                      {feature.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Job Categories */}
      <section className="px-8 py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-gray-800">Top Job Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Currently Popular Jobs in Our Company
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {jobCategories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-200 hover:border-gray-300">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}