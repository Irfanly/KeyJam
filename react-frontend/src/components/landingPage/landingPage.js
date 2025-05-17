import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import { Divider } from 'primereact/divider';
import { ScrollTop } from 'primereact/scrolltop';
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { 
  Music, BookOpenText, Guitar, Upload, LayoutDashboard, 
  FileText, Play, Headphones, Users, Star, Award, Clock
} from 'lucide-react';

// Main landing page for KeyJam
const LandingPage = () => {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const testimonialRef = useRef(null);
  const toast = useRef(null);
  
  // Navigation menu items
  const menuItems = [
    { label: 'Home', icon: 'pi pi-fw pi-home', command: () => window.scrollTo(0, 0) },
    { label: 'Features', icon: 'pi pi-fw pi-star', command: () => document.getElementById('features').scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Testimonials', icon: 'pi pi-fw pi-users', command: () => document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' }) },
  ];

  // Menubar start template
  const start = <div className="flex items-center gap-2">
    <Music size={24} className="text-blue-600" />
    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">KeyJam</span>
  </div>;
  
  // Menubar end template
  const end = <div className="flex items-center gap-3">
    <a href="/login">
      <Button label="Login" className="p-button-text" icon="pi pi-user" />
    </a>
    <a href="/signup">
      <Button label="Sign Up Free" className="p-button-primary" icon="pi pi-user-plus" />
    </a>
  </div>;

  // Testimonial renderer
  const testimonialTemplate = (item) => {
    return (
      <div className="p-4">
        <Card className="h-full shadow-md hover:shadow-lg transition-all">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.title}</p>
              </div>
            </div>
            <div className="flex-grow">
              <p className="italic text-gray-700">"{item.quote}"</p>
            </div>
            <div className="flex mt-4 text-yellow-500">
              {[...Array(5)].map((_, i) => <i key={i} className="pi pi-star-fill mr-1"></i>)}
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="text-gray-800 font-sans">
      <Tooltip target=".custom-tooltip-btn" />
      
      {/* Sticky navbar */}
      <div className="sticky top-0 z-50 shadow-sm bg-white/90 backdrop-blur-sm">
        <Menubar model={menuItems} start={start} end={end} className="border-none" />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Tag value="New" severity="info" rounded className="mr-2"></Tag>
            <Tag value="AI-powered chord detection" icon="pi pi-bolt" severity="info" rounded></Tag>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Master music <span className="text-blue-600">your way</span> with KeyJam
            </h1>
            <p className="text-lg text-gray-600">
              Upload any song and get instant chord suggestions. Practice, customize, and track your progress all in one place.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button label="Start for Free" icon="pi pi-play" className="p-button-lg p-button-primary p-ripple" />
              <Button label="Watch Demo" icon="pi pi-video" className="p-button-lg p-button-outlined p-ripple" />
              <Ripple />
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Users size={16} className="text-blue-500" />
              <span>Join 10,000+ musicians already using KeyJam</span>
            </div>
          </div>
          <div className="relative">
            {/* Hero image - full width */}
            <div className="mb-6">
              <div className="relative rounded-lg overflow-hidden shadow-xl border-8 border-white w-full">
                <img 
                  src="/assets/images/studio-view.png" 
                  alt="KeyJam app interface" 
                  className="w-full h-[450px] object-cover" 
                />
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center p-ripple">
                    <Play size={24} className="text-blue-600 ml-1" />
                    <Ripple />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats section - displayed in a row below the image */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Users, value: "10K+", label: "Active Users" },
                { icon: Music, value: "50K+", label: "Chord Sheets" },
                { icon: Clock, value: "200+", label: "Hours Saved" },
                { icon: Star, value: "4.9", label: "Average Rating" }
              ].map((stat, i) => (
                <Card key={i} className="shadow-sm hover:shadow-md transition-all border-left-3 border-primary">
                  <div className="p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-full mb-3">
                      <stat.icon size={22} className="text-blue-500" />
                    </div>
                    <div className="text-xl font-bold text-blue-600 leading-tight">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Master Music</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              KeyJam combines chord detection, notation, and practice tools in one seamless platform
            </p>
          </div>
          
          <div className="grid-flow-col grid-cols-2 sm:grid-cols-2 gap-12 md:gap-16">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card-wrapper mb-4">
                <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 h-[220px]">
                  <div className="p-5 flex h-full">
                    <div className="mr-5 mt-1">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                        <div className="text-blue-600">{feature.icon}</div>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-blue-800 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 flex-1">{feature.description}</p>
                      <div className="mt-3 flex justify-end">
                        <Button 
                          icon="pi pi-arrow-right" 
                          className="p-button-rounded p-button-text p-button-sm text-blue-500 p-0" 
                          tooltip="Learn more" 
                          tooltipOptions={{position: 'top'}} 
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How KeyJam Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get from song to practice in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Upload Your Song",
                description: "Upload any audio file or paste a YouTube link to get started",
                icon: <Upload size={32} />
              },
              {
                step: "02",
                title: "AI Analyzes Chords",
                description: "Our AI detects chords, key, and structure automatically",
                icon: <Headphones size={32} />
              },
              {
                step: "03",
                title: "Practice & Customize",
                description: "Adjust tempo, transpose keys, loop sections, and track your progress",
                icon: <Guitar size={32} />
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <Card className="h-full shadow-md relative">
                  <Badge value={step.step} severity="primary" className="absolute -top-4 -left-4 w-10 h-10 p-0 flex items-center justify-center rounded-full"></Badge>
                  <div className="pt-6">
                    <div className="p-3 rounded-full bg-blue-50 w-fit mb-4">
                      <div className="text-blue-600">{step.icon}</div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-10 transform -translate-y-1/2 text-gray-300">
                    <i className="pi pi-arrow-right text-3xl"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-white" ref={testimonialRef}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied musicians who've improved their skills with KeyJam
            </p>
          </div>
          
          <Carousel 
            value={[
              {
                name: "Alex Chen", 
                title: "Guitar Teacher",
                image: "https://placehold.co/100/eee/aaa?text=AC",
                quote: "KeyJam has transformed how I teach my students. The chord detection is remarkably accurate and saves me hours of prep time."
              },
              {
                name: "Sarah Johnson", 
                title: "Indie Musician",
                image: "https://placehold.co/100/eee/aaa?text=SJ",
                quote: "I've tried many chord apps, but KeyJam's interface and accuracy are unmatched. It's become an essential part of my songwriting process."
              },
              {
                name: "Marcus Rivera", 
                title: "Music Student",
                image: "https://placehold.co/100/eee/aaa?text=MR",
                quote: "As a beginner, KeyJam has helped me learn songs much faster than traditional methods. The practice tracking keeps me motivated."
              },
              {
                name: "Priya Sharma", 
                title: "Band Leader",
                image: "https://placehold.co/100/eee/aaa?text=PS",
                quote: "My band uses KeyJam to quickly learn new songs for our setlist. The ability to transpose instantly is a game-changer."
              }
            ]} 
            numVisible={3}
            numScroll={1}
            responsiveOptions={[
              {
                breakpoint: '1024px',
                numVisible: 3,
                numScroll: 1
              },
              {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 1
              },
              {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
              }
            ]}
            itemTemplate={testimonialTemplate}
            circular
            autoplayInterval={5000}
          />
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto">
          <Panel className="bg-transparent border-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Music Practice?</h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of musicians who are already improving with KeyJam.
                Start your musical journey today — no credit card required.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  label="Get Started Free" 
                  icon="pi pi-play-circle" 
                  className="p-button-lg p-button-warning p-ripple custom-tooltip-btn" 
                  tooltip="Create your free account now"
                  tooltipOptions={{ position: 'top' }} 
                />
                <Button 
                  label="Watch Demo" 
                  icon="pi pi-video" 
                  className="p-button-lg p-button-outlined p-button-warning p-ripple custom-tooltip-btn" 
                  tooltip="See KeyJam in action"
                  tooltipOptions={{ position: 'top' }} 
                />
                <Ripple />
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music size={24} className="text-blue-400" />
                <span className="text-xl font-bold">KeyJam</span>
              </div>
              <p className="text-sm text-gray-400">
                Your all-in-one companion for learning, practicing, and mastering music.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple">
                  <i className="pi pi-facebook text-lg"></i>
                  <Ripple />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple">
                  <i className="pi pi-twitter text-lg"></i>
                  <Ripple />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple">
                  <i className="pi pi-instagram text-lg"></i>
                  <Ripple />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple">
                  <i className="pi pi-youtube text-lg"></i>
                  <Ripple />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>Features</span>
                    <Ripple />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>Tutorials</span>
                    <Ripple />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>About Us</span>
                    <Ripple />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>Contact</span>
                    <Ripple />
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>Help Center</span>
                    <Ripple />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>Community</span>
                    <Ripple />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>Privacy Policy</span>
                    <Ripple />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors p-ripple flex items-center gap-2">
                    <i className="pi pi-angle-right"></i>
                    <span>Terms of Service</span>
                    <Ripple />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <Divider className="border-gray-700" />
          
          <div className="text-center text-sm text-gray-400 pt-4">
            &copy; 2024 KeyJam. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      <ScrollTop icon="pi pi-chevron-up" />
    </div>
  );
};

// Define all feature blocks here
const features = [
  {
    title: 'AI Chord Detection',
    description: 'Upload audio files or YouTube links to automatically detect chords with high accuracy.',
    icon: <Upload size={28} />
  },
  {
    title: 'Digital Songbook',
    description: 'Organize your chord sheets into collections. Search, filter, and access your music anytime.',
    icon: <BookOpenText size={28} />
  },
  {
    title: 'Practice Tools',
    description: 'Loop sections, adjust tempo, transpose keys, and track your practice sessions.',
    icon: <Guitar size={28} />
  },
  {
    title: 'Interactive Fretboard',
    description: 'Visualize scales, chords and progressions on an interactive fretboard for any instrument.',
    icon: <LayoutDashboard size={28} />
  },
  {
    title: 'Export & Share',
    description: 'Download your chord sheets as PDFs or share them directly with other musicians.',
    icon: <FileText size={28} />
  },
  {
    title: 'Progress Tracker',
    description: 'Set goals and track your practice statistics with visual reports and insights.',
    icon: <Music size={28} />
  }
];

export default LandingPage;