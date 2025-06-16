import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { Music, Search, Plus, Eye, Trash, Edit, FileMusic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectLayout from "../Layouts/ProjectLayout";
import client from "../../services/restClient";

const ChordSheets = (props) => {
  const [loading, setLoading] = useState(true);
  const [chordSheets, setChordSheets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.user?._id) {
      // User not loaded yet, don't fetch
      return;
    }
    props.show();
    const userId = props.user._id;
    console.log("User ID:", userId);
    client
      .service("chordSheets")
      .find({
        query: {
          createdBy: userId,
          $limit: 100,
          $sort: { updatedAt: -1 },
          $populate: [{ path: "createdBy", service: "users", select: ["name"] }]
        }
      })
      .then((result) => {
        setChordSheets(result.data || []);
        console.log("Fetched chord sheets:", result.data);
        setLoading(false);
        props.hide();
      })
      .catch((error) => {
        console.error("Error fetching chord sheets:", error);
        setLoading(false);
        props.hide();
        props.alert({
          type: "error",
          title: "Error",
          message: "Failed to load your chord sheets"
        });
      });
  }, [props.user?._id]);

  // Filter chord sheets based on search term
  const filteredSheets = searchTerm 
    ? chordSheets.filter(sheet => 
        sheet.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    : chordSheets;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const navigateToStudio = () => {
    navigate('/chordStudio');
  };
  
  const viewChordSheet = (sheetId) => {
    navigate(`/chordSheets/${sheetId}`);
  };

  const deleteChordSheet = (sheetId) => {
    client.service("chordSheets").remove(sheetId)
      .then(() => {
        setChordSheets(chordSheets.filter(sheet => sheet._id !== sheetId));
        props.alert({
          type: "success",
          title: "Success",
          message: "Chord sheet deleted successfully"
        });
      })
      .catch((error) => {
        console.error("Error deleting chord sheet:", error);
        props.alert({
          type: "error",
          title: "Error",
          message: "Failed to delete chord sheet"
        });
      });
  }

  return (
    <ProjectLayout>
      <div className="p-5 md:p-6">
        {/* Page Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 rounded-lg p-5 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-indigo-800 mb-1">My Chord Sheets</h1>
              <p className="text-sm text-indigo-600">Manage and view your saved chord sheets</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <span className="p-input-icon-left relative w-full sm:w-64">
                <Search 
                  size={18} 
                  className="text-gray-500 absolute top-1/2 left-3 transform -translate-y-1/2" 
                />
                <InputText 
                  placeholder="Search by title" 
                  className="w-full pl-10 border-indigo-100 focus:border-indigo-300" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </span>
              
              <Button 
                icon={<Plus size={18} />} 
                label="Create New" 
                className="p-button-primary"
                onClick={navigateToStudio}
              />
            </div>
          </div>
        </div>
        
        {/* Content section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm">
            <i className="pi pi-spin pi-spinner text-indigo-500 text-4xl mb-4" />
            <p className="text-gray-600">Loading your chord sheets...</p>
          </div>
        ) : filteredSheets.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm">
            <div className="bg-indigo-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Music size={34} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              {searchTerm ? "No matching chord sheets found" : "You don't have any chord sheets yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try a different search term or clear the search" 
                : "Create your first chord sheet to get started with KeyJam"}
            </p>
            <Button 
              icon={<Plus size={18} />} 
              label="Create in Chord Studio" 
              className="p-button-primary"
              onClick={navigateToStudio}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSheets.map((sheet) => (
              <Card 
                key={sheet._id}
                className="shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden"
                header={
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b">
                    <div className="flex items-center">
                      <FileMusic size={18} className="text-indigo-500 mr-2 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {sheet.title || "Untitled"}
                      </h3>
                    </div>
                  </div>
                }
              >
                <div className="p-2">
                  {/* Song Key */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">
                      {sheet.artist && <span className="italic">by {sheet.artist}</span>}
                    </span>
                    <Badge 
                      value={sheet.key || "N/A"} 
                      severity="info"
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                    />
                  </div>
                  
                  {/* Last Updated */}
                  <div className="text-xs text-gray-500 mb-4">
                    Last updated: {formatDate(sheet.updatedAt)}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <Button 
                      label="View" 
                      icon={<Eye size={16} />} 
                      className="p-button-outlined p-button-sm"
                      onClick={() => viewChordSheet(sheet._id)}
                    />
                    
                    <div>
                      <Button 
                        icon={<Edit size={16} />}
                        className="p-button-text p-button-sm mr-2" 
                        tooltip="Edit"
                        aria-label="Edit"
                      />
                      <Button 
                        icon={<Trash size={16} />}
                        className="p-button-text p-button-danger p-button-sm" 
                        tooltip="Delete"
                        aria-label="Delete"
                        onClick={() => deleteChordSheet(sheet._id)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProjectLayout>
  );
};

const mapStateToProps = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatchToProps = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChordSheets);