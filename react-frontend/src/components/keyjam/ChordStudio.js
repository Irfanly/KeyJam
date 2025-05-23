// Page to uplaod audio files

import React, { useState } from 'react';
import storage from '../../services/supabase/storage';
import gemini from '../../services/gemini/prompt';
import ProjectLayout from "../Layouts/ProjectLayout";

const ChordStudio = () => {
  const [file, setFile] = useState(null);
  const [songKey, setSongKey] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeyChange = (e) => {
    setSongKey(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !songKey) {
      alert('Please select a file and enter the song key.');
      return;
    }

    setLoading(true);

    try {
      // Upload the file to Supabase Storage
      const filePath = `audio/${file.name}`;
      await storage.uploadFile('audio', filePath, file);

      // Get the public URL of the uploaded file
      const { publicUrl } = await storage.getUrl('audio', filePath);
      console.log('Public URL:', publicUrl);

      // Generate the prompt using Gemini
      const prompt = await gemini.analyzeAudio(publicUrl, songKey);

      // Set the output
      setOutput(prompt);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectLayout>
      <div className="chord-studio">
        <h1>Chord Studio</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
          <input
            type="text"
            placeholder="Enter song key (e.g., C, G#)"
            value={songKey}
            onChange={handleKeyChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
        {output && (
          <div>
            <h2>Output</h2>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </ProjectLayout>
  );
}
export default ChordStudio;