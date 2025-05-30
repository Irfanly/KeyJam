import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from "react-redux";
import client from "../../services/restClient";
import ProjectLayout from "../Layouts/ProjectLayout";
import { Card } from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FileAudio, Guitar, Save, ArrowLeft } from "lucide-react";

const musicalKeys = [
  { label: 'C Major', value: 'C' }, { label: 'G Major', value: 'G' }, { label: 'D Major', value: 'D' },
  { label: 'A Major', value: 'A' }, { label: 'E Major', value: 'E' }, { label: 'B Major', value: 'B' },
  { label: 'F# Major', value: 'F#' }, { label: 'F Major', value: 'F' }, { label: 'Bb Major', value: 'Bb' },
  { label: 'Eb Major', value: 'Eb' }, { label: 'Ab Major', value: 'Ab' }, { label: 'A Minor', value: 'Am' },
  { label: 'E Minor', value: 'Em' }, { label: 'B Minor', value: 'Bm' }, { label: 'F# Minor', value: 'F#m' },
  { label: 'C# Minor', value: 'C#m' }, { label: 'G# Minor', value: 'G#m' }, { label: 'D Minor', value: 'Dm' },
];

const ChordEditor = (props) => {
  const { singleChordSheetsId } = useParams();
  const [chordSheet, setChordSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);
  
  useEffect(() => {
    if (!props.user?._id) {
      // User not loaded yet, don't fetch
      return;
    }
    
    if (!singleChordSheetsId) return;
    
    props.show();
    setLoading(true);
    
    client
      .service("chordSheets")
      .get(singleChordSheetsId)
      .then((data) => {
        setChordSheet(data);
        setLoading(false);
        props.hide();
      })
      .catch((error) => {
        console.error("Error fetching chord sheet:", error);
        setChordSheet(null);
        setLoading(false);
        props.hide();
        props.alert({
          type: "error",
          title: "Error",
          message: "Failed to load chord sheet"
        });
      });
  }, [singleChordSheetsId, props.user?._id]);

  // Handle field changes
  const handleChange = (e) => {
    setChordSheet({ ...chordSheet, [e.target.name]: e.target.value });
  };

  const handleKeyChange = (e) => {
    setChordSheet({ ...chordSheet, key: e.value });
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    
    try {
      const updateData = {
        ...chordSheet,
        updatedBy: props.user._id
      };
      
      // Save to database
      const result = await client.service("chordSheets").patch(singleChordSheetsId, updateData);
      
      // Update local state with the result
      setChordSheet(result);
      
      toast.current.show({
        severity: 'success',
        summary: 'Saved',
        detail: 'Changes saved successfully',
        life: 3000
      });
    } catch (error) {
      console.error("Error saving chord sheet:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Save Failed',
        detail: error.message || 'Could not save changes',
        life: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    navigate('/chordSheets');
  };

  if (loading) {
    return (
      <ProjectLayout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Card className="shadow-lg">
            <div className="flex flex-col items-center p-6">
              <i className="pi pi-spin pi-spinner text-indigo-500 text-4xl mb-4" />
              <p className="text-gray-600">Loading chord sheet...</p>
            </div>
          </Card>
        </div>
      </ProjectLayout>
    );
  }

  if (!chordSheet) {
    return (
      <ProjectLayout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Card className="shadow-lg">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              <p className="font-medium">Chord sheet not found</p>
              <p className="mt-2">The chord sheet you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button 
                label="Back to Chord Sheets" 
                icon={<ArrowLeft size={16} />}
                className="mt-4 p-button-outlined"
                onClick={goBack}
              />
            </div>
          </Card>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="min-h-screen py-6">
        <div className="container mx-auto px-4">
          {/* Header Bar with Controls */}
          <div className="rounded-lg shadow-lg p-4 mb-4 flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <Guitar className="text-amber-500" size={28} />
              <h1 className="text-xl font-bold text-black">{chordSheet.title || "Untitled Song"}</h1>
              <span className="text-gray-700 text-sm">by {chordSheet.artist || "Unknown Artist"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                icon={<Save size={16} />} 
                label={saving ? "Saving..." : "Save"}
                className="p-button-sm p-button-success"
                disabled={saving}
                onClick={handleSave}
              />
              <Button 
                icon={<ArrowLeft size={16} />} 
                label="Back" 
                className="p-button-sm p-button-outlined p-button-secondary"
                onClick={goBack}
              />
            </div>
          </div>
          
          {chordSheet.audioFileUrl && (
            <div className="bg-white rounded-lg p-5 mb-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium text-gray-800">Reference Audio</label>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  {chordSheet.audioFileName?.split('.').pop() || "audio"} file
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-md">
                <FileAudio size={20} className="text-amber-500" />
                <span className="text-sm text-gray-700 font-medium truncate">
                  {chordSheet.audioFileName || "Audio File"}
                </span>
              </div>
              <audio 
                controls 
                className="w-full h-12 rounded" 
                src={chordSheet.audioFileUrl}
                preload="metadata"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
            {/* Left Column - Metadata - Sticky */}
            <div className="lg:col-span-1 lg:sticky lg:top-20 lg:self-start">
              <Card className="shadow-lg bg-white text-gray-800 border-l-4 border-amber-500 overflow-hidden">
                <div className="bg-amber-50 p-3 -mx-4 -mt-4 mb-4 border-b border-amber-200">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FileAudio size={20} className="text-amber-500" /> Song Details
                  </h2>
                </div>
                
                <div className="space-y-5">
                  {/* Song Title */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Song Title
                    </label>
                    <InputText
                      name="title"
                      value={chordSheet.title || ""}
                      onChange={handleChange}
                      className="w-full shadow-sm border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Enter song title"
                    />
                  </div>
                  
                  {/* Artist */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Artist
                    </label>
                    <InputText
                      name="artist"
                      value={chordSheet.artist || ""}
                      onChange={handleChange}
                      className="w-full shadow-sm border-gray-300 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Enter artist name"
                    />
                  </div>
                  
                  {/* Song Key */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Song Key
                    </label>
                    <Dropdown
                      value={chordSheet.key || ""}
                      options={musicalKeys}
                      onChange={handleKeyChange}
                      placeholder="Select song key"
                      className="w-full shadow-sm"
                    />
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right Column - Chord Editor */}
            <div className="mx-auto lg:col-span-3">
              <Card className="shadow-lg bg-white overflow-hidden">
                <div className="bg-gray-50 p-3 -mx-4 -mt-4 mb-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Guitar size={20} className="text-amber-500" /> Chords & Lyrics
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Key: </span>
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      {chordSheet.key || "Not set"}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">                                    
                  {/* Lyrics Editor */}
                  <div className="border border-gray-200 rounded-b-lg">
                    <textarea
                      name="lyricsWithChords"
                      value={chordSheet.lyricsWithChords || ""}
                      onChange={handleChange}
                      rows={24}
                      className="w-full border-0 p-4 font-mono text-sm focus:ring-0 focus:outline-none resize-y"
                      placeholder="Enter lyrics with chords (e.g. [Am]Hello [C]world)"
                      style={{ fontFamily: "Courier New, monospace" }}
                    />
                  </div>
                  
                  {/* Tips Card */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                    <p className="font-medium flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Pro Tips:
                    </p>
                    <ul className="mt-2 space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                        Use <code className="bg-amber-200 px-1 rounded">[chord]</code> format to add chords (e.g. <code className="bg-amber-200 px-1 rounded">[G] [Em7]</code>)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                        Add section markers with <code className="bg-amber-200 px-1 rounded">{"{"+"section: Verse"+"}"}</code> or <code className="bg-amber-200 px-1 rounded">{"{"+"section: Chorus"+"}"}</code>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5"></span>
                        Add comments with <code className="bg-amber-200 px-1 rounded">#</code> at the start of a line
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChordEditor);