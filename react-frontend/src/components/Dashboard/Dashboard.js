import React, { useEffect, useState } from "react";
import { Plus, Guitar, Music } from "lucide-react";
import ProjectLayout from "../Layouts/ProjectLayout"; // Adjust path as needed

// Placeholder fetch function
const fetchRecentChordSheets = () => {
  // Simulate fetch delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Let It Be", artist: "The Beatles" },
        { id: 2, title: "Stand By Me", artist: "Ben E. King" },
        { id: 3, title: "Someone Like You", artist: "Adele" },
        { id: 4, title: "Canon in D", artist: "Pachelbel" },
      ]);
    }, 1000);
  });
};

const Dashboard = () => {
  const [recentChords, setRecentChords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentChordSheets().then((data) => {
      setRecentChords(data);
      setLoading(false);
    });
  }, []);

  return (
    <ProjectLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gray-100 p-6 rounded-lg text-center shadow-sm">
          <h1 className="text-2xl font-semibold">Welcome back, Irfan</h1>
          <p className="text-lg text-gray-600 mt-1">Ready to start Jamming ???</p>
        </div>

        {/* Recently Opened Chord Sheets */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recently Opened Chord Sheets</h2>

          {loading ? (
            <p>Loading...</p>
          ) : recentChords.length === 0 ? (
            <div className="text-center text-gray-600">
              No recent chord sheets found. <br />
              <button className="mt-2 text-blue-600 underline hover:text-blue-800">
                Upload a new song →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentChords.map((chord, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 p-4 rounded-lg hover:shadow-md transition"
                >
                  <p className="font-medium">{chord.title}</p>
                  <p className="text-sm text-gray-500">{chord.artist}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Access */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-white border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Upload New Song</span>
            </button>
            <button className="bg-white border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
              <Guitar className="w-6 h-6" />
              <span className="text-sm font-medium">Songbook</span>
            </button>
            <button className="bg-white border rounded-lg p-6 flex flex-col items-center gap-2 hover:shadow-md transition">
              <Music className="w-6 h-6" />
              <span className="text-sm font-medium">Explore Chords</span>
            </button>
          </div>
        </section>
      </div>
    </ProjectLayout>
  );
};

export default Dashboard;
