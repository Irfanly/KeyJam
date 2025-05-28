import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import client from "../../services/restClient";
import storage from '../../services/supabase/storage';
import gemini from '../../services/gemini/prompt';
import ProjectLayout from "../Layouts/ProjectLayout";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { FileAudio, Music, AudioWaveform, HelpCircle, Guitar } from 'lucide-react';

const musicalKeys = [
  { label: 'C Major', value: 'C' }, { label: 'G Major', value: 'G' }, { label: 'D Major', value: 'D' },
  { label: 'A Major', value: 'A' }, { label: 'E Major', value: 'E' }, { label: 'B Major', value: 'B' },
  { label: 'F# Major', value: 'F#' }, { label: 'F Major', value: 'F' }, { label: 'Bb Major', value: 'Bb' },
  { label: 'Eb Major', value: 'Eb' }, { label: 'Ab Major', value: 'Ab' }, { label: 'A Minor', value: 'Am' },
  { label: 'E Minor', value: 'Em' }, { label: 'B Minor', value: 'Bm' }, { label: 'F# Minor', value: 'F#m' },
  { label: 'C# Minor', value: 'C#m' }, { label: 'G# Minor', value: 'G#m' }, { label: 'D Minor', value: 'Dm' },
];

const ChordStudio = (props) => {
  const [file, setFile] = useState(null);
  const [songKey, setSongKey] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [artist, setArtist] = useState('Unknown');
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const toast = useRef(null);

  const getChordSheetData = () => {
    return {
      userId: props.user?._id,
      title: songTitle || "Untitled Song",
      artist: artist,
      key: songKey,
      audioFileName: file ? file.name : "",
      audioFileUrl: audioUrl || "",
      lyrics: output || "",  // extract just lyrics if possible
      lyricsWithChords: output || "",
      suggestedChords: output || "",
      createdBy: props.user?._id,
      updatedBy: props.user?._id
    };
  };

  const validate = () => {
    let ret = true;
    const error = {};

    if (_.isEmpty(songKey)) {
      error["key"] = `Song key is required`;
      ret = false;
    }

    if (_.isEmpty(songTitle)) {
      error["title"] = `Song title is required`;
      ret = false;
    }

    // Only validate output if we're trying to save
    if (_.isEmpty(output)) {
      error["output"] = `Generated chord analysis is required`;
      ret = false;
    }

    if (!ret) setError(error);
    return ret;
  };

  useEffect(() => {
    if (!props.user?._id) {
      // User not loaded yet, don't fetch
      return;
    }
    props.show();
    const userId = props.user._id;
    console.log("User ID:", userId);
    props.hide();
  }, [props.user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeyChange = (e) => {
    setSongKey(e.value);
  };

  const handleTitleChange = (e) => {
    setSongTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!songKey) {
      toast.current.show({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select a song key',
        life: 3000
      });
      return;
    }

    setLoading(true);

    try {
      let publicUrl = '';
      if (file) {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filePath = `audio/${timestamp}_${safeName}`;
        await storage.uploadFile('audio', filePath, file);
        publicUrl = await storage.getUrl('audio', filePath);
        setAudioUrl(publicUrl);
      }

      toast.current.show({
        severity: 'info',
        summary: 'Analyzing',
        detail: 'Generating chord suggestions...',
        life: 3000
      });

      const response = await gemini.analyzeAudio(file, songKey);
      setOutput(response);

      toast.current.show({
        severity: 'success',
        summary: 'Done',
        detail: 'Chord suggestions generated!',
        life: 3000
      });
    } catch (error) {
      console.error('Error:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'An error occurred during analysis',
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  // Separate function for saving to database
  const saveChordSheet = async () => {
    if(!validate()) {
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields',
        life: 3000
      });
      return;
    }
    
    setLoading(true);
    try {
      const chordSheetData = getChordSheetData();
      const result = await client.service("chordSheets").create(chordSheetData);
      
      toast.current.show({
        severity: 'success',
        summary: 'Saved',
        detail: 'Chord sheet saved successfully!',
        life: 3000
      });
      
      navigate(`/chordSheets`);
      
    } catch (error) {
      console.error('Error saving chord sheet:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Save Error',
        detail: error.message || 'Failed to save chord sheet',
        life: 4000
      });
      setError(error.errors || { general: error.message || "Failed to save" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="max-w-screen mx-auto py-8 px-10 md:px-20 lg:px-32">
        <Card className="shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <AudioWaveform className="text-indigo-500" size={32} />
            <h1 className="text-2xl font-bold text-indigo-700">Chord Studio</h1>
          </div>
          
          <div className="bg-blue-50 rounded p-4 mb-6 flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-400" />
            <span className="text-sm text-blue-700">
              Upload your audio (optional) and select the song key to generate chord progressions and analysis.
            </span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
              <InputText
                value={songTitle}
                onChange={handleTitleChange}
                placeholder="Enter song title"
                className="w-full"
              />
              {error.title && <small className="p-error">{error.title}</small>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
              <InputText
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist name"
                className="w-full"
              />
            </div>            
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Audio File (optional)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
                {file && (
                  <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded">
                    <FileAudio size={16} className="text-indigo-500" />
                    <span className="text-xs text-indigo-700">{file.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Song Key <span className="text-red-500">*</span></label>
              <Dropdown
                value={songKey}
                options={musicalKeys}
                onChange={handleKeyChange}
                placeholder="Select song key"
                className="w-full"
                required
              />
              {error.key && <small className="p-error">{error.key}</small>}
            </div>
            
            <Button
              type="submit"
              label={loading ? "Analyzing..." : "Analyze"}
              icon={loading ? "pi pi-spin pi-spinner" : <Music size={18} />}
              className="w-full"
              disabled={loading}
            />
            
            {loading && (
              <div className="mt-2">
                <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
              </div>
            )}
          </form>
          
          {audioUrl && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <FileAudio size={18} className="text-indigo-500" />
                <span className="text-sm text-gray-700">Your uploaded audio:</span>
              </div>
              <audio controls className="w-full" src={audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          {output && (
            <>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                  <Guitar size={20} /> Chord Suggestions & Analysis
                </h2>
                <pre className="bg-gray-50 border rounded p-4 whitespace-pre-wrap text-sm overflow-x-auto">{output}</pre>
                {error.output && <small className="p-error">{error.output}</small>}
              </div>
              
              <div className="mt-6">
                <Button 
                  label="Save Chord Sheet" 
                  icon="pi pi-save" 
                  className="p-button-success w-full"
                  onClick={saveChordSheet}
                  disabled={loading}
                />
              </div>
            </>
          )}
          
          {!_.isEmpty(error) && Object.keys(error).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 pl-5 text-sm text-red-700 list-disc">
                {Object.keys(error).map(key => (
                  <li key={key}>{error[key]}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
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

export default connect(mapState, mapDispatch)(ChordStudio);