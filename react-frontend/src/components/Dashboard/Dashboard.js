import React, { useEffect, useState } from "react";
import { Plus, Guitar, Music, UserCircle } from "lucide-react";
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
    // Show loading state
    props.show();
    
    // Get current user ID from Redux state
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
        
        // After getting user data, fetch their recent chord sheets
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
        props.hide(); // Hide loading indicator
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
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <UserCircle size={48} className="text-indigo-500" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold">
                Welcome back, {userData?.name || props.user?.name || "User"}
              </h1>
              <p className="text-lg text-gray-600 mt-1">Ready to start Jamming?</p>
            </div>
          </div>
        </div>

        {/* Recently Opened Chord Sheets */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recently Added Chord Sheets</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              View All <span className="pi pi-arrow-right ml-1" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <i className="pi pi-spin pi-spinner text-indigo-500" style={{ fontSize: '2rem' }}></i>
            </div>
          ) : recentChords.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <Music size={48} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-600 mb-2">No chord sheets yet</p>
              <button className="mt-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition">
                Create your first chord sheet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recentChords.map((chord) => (
                <div
                  key={chord._id}
                  className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition flex flex-col"
                >
                  <p className="font-medium text-gray-800">{chord.title || chord.name}</p>
                  <p className="text-sm text-gray-500">{chord.artist || "Unknown Artist"}</p>
                  <div className="mt-auto pt-3 text-xs text-gray-400">
                    Last updated: {new Date(chord.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button onClick={() => navigate("/chordSheets")} className="bg-white border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
              <Plus className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium">Upload New Song</span>
            </button>
            <button onClick={() => navigate("/songFolders")} className="bg-white border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
              <Music className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium">Songbook</span>
            </button>
            <button onClick={() => navigate("/chordLibrary")} className="bg-white border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
              <Guitar className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium">Explore Chords</span>
            </button>
          </div>
        </section>
      </div>
    </ProjectLayout>
  );
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