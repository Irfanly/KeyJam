import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import client from "../../services/restClient";
import storage from '../../services/supabase/storage';
import gemini from '../../services/gemini/prompt';
import ProjectLayout from "../Layouts/ProjectLayout";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { FileAudio, Music, Loader2, AudioWaveform } from 'lucide-react';

const SongAnalysisUpload = (props) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [audioFileUrl, setAudioFileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.user?._id) return;
  }, [props.user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    setAudioFileName(file ? file.name : '');
  };

  const handleUpload = async () => {
    if (!audioFile) return '';
    setLoading(true);
    setProgress(10);
    try {
      // Upload to Supabase
      const timestamp = Date.now();
      const safeName = audioFileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
      const filePath = `audio/${timestamp}_${safeName}`;
      await storage.uploadFile('audio', filePath, audioFile);
      const publicUrl = await storage.getUrl('audio', filePath);
      setAudioFileUrl(publicUrl);
      setProgress(70);
      return publicUrl;
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Upload Failed', detail: err.message, life: 3000 });
      setLoading(false);
      return '';
    }
  };

  const handleAnalyze = async () => {
    if (!title || !artist || !audioFile) {
      toast.current.show({ severity: 'warn', summary: 'Missing Fields', detail: 'Please fill all fields and upload an audio file.', life: 3000 });
      return;
    }
    setLoading(true);
    setProgress(5);

    // 1. Upload audio
    let url = audioFileUrl;
    if (!url) {
      url = await handleUpload();
      if (!url) {
        setLoading(false);
        return;
      }
    }

    setProgress(80);

    // 2. Generate AI analysis
    let aiAnalysis = {};
    try {
      aiAnalysis = await gemini.songAnalysis(audioFile, { title, artist });
      if (typeof aiAnalysis === 'string') {
        aiAnalysis = aiAnalysis.replace(/```json|```/g, '').trim();
        aiAnalysis = JSON.parse(aiAnalysis);
      }
      setProgress(95);
      console.log("AI Analysis Result:", aiAnalysis);
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'AI Analysis Failed', detail: err.message, life: 3000 });
      setLoading(false);
      return;
    }

    // 3. Save to MongoDB
    try {
      const doc = await client.service('songAnalysis').create({
        userId: props.user._id,
        title,
        artist,
        audioFileName,
        audioFileUrl: url,
        analysis: aiAnalysis,
        createdBy: props.user._id,
        updatedBy: props.user._id,
      });
      setProgress(100);
      setLoading(false);
      toast.current.show({ severity: 'success', summary: 'Analysis Complete', detail: 'AI analysis saved!', life: 2000 });
      setTimeout(() => navigate(`/songAnalysis/${doc._id}`), 1200);
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'Save Failed', detail: err.message, life: 3000 });
      setLoading(false);
    }
  };

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="max-w-xl mx-auto py-10">
        <Card className="shadow-lg border-0">
          <div className="mb-6 flex items-center gap-3">
            <AudioWaveform size={28} className="text-indigo-500" />
            <h2 className="text-2xl font-semibold text-gray-800">Song Analysis Upload</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Song Title</label>
              <InputText
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full"
                placeholder="Enter song title"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
              <InputText
                value={artist}
                onChange={e => setArtist(e.target.value)}
                className="w-full"
                placeholder="Enter artist name"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Audio File</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="block"
                />
                {audioFileName && (
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <FileAudio size={16} className="text-amber-500" /> {audioFileName}
                  </span>
                )}
              </div>
            </div>
            {loading && (
              <div>
                <ProgressBar value={progress} showValue={false} className="h-2" />
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Loader2 className="animate-spin" size={16} />
                  Processing...
                </div>
              </div>
            )}
            <Button
              label={loading ? "Analyzing..." : "Generate AI Analysis"}
              icon={<Music size={16} />}
              className="w-full bg-indigo-600 border-indigo-600"
              onClick={handleAnalyze}
              disabled={loading}
            />
          </div>
        </Card>
      </div>
    </ProjectLayout>
  );
};

const mapToState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapToDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapToState, mapToDispatch)(SongAnalysisUpload);