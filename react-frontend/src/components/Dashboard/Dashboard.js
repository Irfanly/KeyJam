import React, { useEffect, useState } from "react";
import { Plus, Guitar, Music, UserCircle, Calendar, Clock, ChevronRight, Search, Layers, AudioLines } from "lucide-react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProjectLayout from "../Layouts/ProjectLayout";
import client from "../../services/restClient";

const Dashboard = (props) => {
  const [recentChords, setRecentChords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user data and recent chord sheets
  useEffect(() => {
    props.show();
    
    const userId = props.user?._id;
    console.log("Current User ID:", userId);
    
    if (!userId) {
      console.error("User not authenticated or ID not available");
      props.hide();
      setLoading(false);
      return;
    }
    
    // Fetch user data from MongoDB
    client
      .service("users")
      .get(userId)
      .then((userResult) => {
        console.log("User data fetched:", userResult);
        setUserData(userResult);
        
        return client
          .service("chordSheets")
          .find({
            query: {
              createdBy: userId,
              $limit: 4,
              $sort: { updatedAt: -1 },
              $populate: [
                { path: "createdBy", service: "users", select: ["name"] }
              ]
            }
          });
      })
      .then((chordsResult) => {
        setRecentChords(chordsResult.data || []);
        setLoading(false);
        props.hide();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        props.alert({
          title: "Dashboard",
          type: "error",
          message: "Failed to fetch user data"
        });
        setLoading(false);
        props.hide();
      });
  }, []);

  return (
    <ProjectLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {/* Hero Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl my-6">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
            <svg viewBox="0 0 400 400" className="h-full">
              <defs>
                <pattern id="music-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M0,10 L20,10 M10,0 L10,20" stroke="white" strokeWidth="1" fill="none"/>
                </pattern>
              </defs>
              <rect x="0" y="0" width="400" height="400" fill="url(#music-pattern)"/>
              <circle cx="200" cy="150" r="100" fill="rgba(255,255,255,0.1)" />
              <path d="M150,50 Q200,25 250,50 T350,50" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="py-10 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between relative z-10">
            <div className="flex items-center gap-5 mb-6 sm:mb-0">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                <UserCircle size={52} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {userData?.name || props.user?.name || "Musician"}!
                </h1>
                <p className="text-blue-100 mt-1 flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date().toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/profile")}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all flex items-center gap-2"
            >
              View Profile <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recently Added */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Music size={20} className="text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">Recently Added Chord Sheets</h2>
                </div>
                <button 
                  onClick={() => navigate("/chordSheets")}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center transition-all"
                >
                  View All <ChevronRight size={16} />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : recentChords.length === 0 ? (
                <div className="text-center p-10 bg-gray-50">
                  <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
                    <Music size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-600 mb-3">No chord sheets yet</p>
                  <button 
                    onClick={() => navigate("/chordSheets/create")}
                    className="transition-all bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus size={18} />
                    Create your first chord sheet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 bg-gray-100">
                  {recentChords.map((chord) => (
                    <div
                      key={chord._id}
                      onClick={() => navigate(`/chordSheets/${chord._id}`)}
                      className="bg-white p-5 cursor-pointer hover:bg-gray-50 transition-all border-b border-r border-gray-100 relative group"
                    >
                      {/* Card content */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={16} className="text-indigo-400" />
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                          <Layers size={16} className="text-indigo-500" />
                        </div>
                        <h3 className="font-medium text-gray-900 truncate">{chord.title || chord.name}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3 pl-9">{chord.artist || "Unknown Artist"}</p>
                      
                      <div className="pl-9 flex items-center text-xs text-gray-400">
                        <Clock size={12} className="mr-1" />
                        <span>Updated {formatRelativeTime(chord.updatedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Access */}
          <div className="space-y-6">
            {/* Quick Access */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 p-5 border-b">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Guitar size={20} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Quick Access</h2>
              </div>
              <div className="p-5 space-y-3">
                <QuickAccessButton 
                  icon={<Plus size={18} className="text-indigo-100" />} 
                  title="Upload New Song"
                  description="Add a new chord sheet to your collection"
                  color="bg-gradient-to-r from-indigo-600 to-indigo-500"
                  onClick={() => navigate("/chordStudio")}
                />
                
                <QuickAccessButton 
                  icon={<Music size={18} className="text-amber-100" />} 
                  title="Your Songbook"
                  description="Browse all your saved songs"
                  color="bg-gradient-to-r from-amber-600 to-amber-500"
                  onClick={() => navigate("/chordSheets")}
                />
                
                <QuickAccessButton 
                  icon={<Guitar size={18} className="text-emerald-100" />} 
                  title="Explore Chords"
                  description="Learn new chords and progressions"
                  color="bg-gradient-to-r from-emerald-600 to-emerald-500"
                  onClick={() => navigate("/chordLibrary")}
                />

                <QuickAccessButton
                  icon={<AudioLines size={18} className="text-purple-100" />} 
                  title="Analyze Songs"
                  description="Use AI to analyze your songs"
                  color="bg-gradient-to-r from-purple-600 to-purple-500"
                  onClick={() => navigate("/songAnalysis")}
                />
              </div>
            </div>

            {/* Tips Widget */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-blue-800">Quick Tip</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Pro Tip</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Try transposing your chord sheets to find the perfect key for your voice range.
              </p>
              <button className="text-xs text-blue-700 font-medium hover:underline">
                Learn more about transposing
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

// Helper component for quick access buttons
const QuickAccessButton = ({ icon, title, description, color, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left ${color} text-white hover:shadow-lg transition-all`}
    >
      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-white/80">{description}</div>
      </div>
    </button>
  );
};

// Helper function to format dates in relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) {
    return date.toLocaleDateString();
  } else if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  const { cache } = state.cache;
  return { user, isLoggedIn, cache };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapState, mapDispatch)(Dashboard);