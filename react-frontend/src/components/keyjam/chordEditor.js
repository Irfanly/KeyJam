import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import ProjectLayout from "../Layouts/ProjectLayout";
import Card from "primereact/card";
import { ProgressBar } from "primereact/progressbar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Guitar } from "lucide-react";

const ChordEditor = () => {
  const { id } = useParams();
  const [chordSheet, setChordSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    client
      .service("chordSheets")
      .get(id)
      .then((data) => {
        setChordSheet(data);
        setLoading(false);
      })
      .catch(() => {
        setChordSheet(null);
        setLoading(false);
      });
  }, [id]);

  // Handle field changes
  const handleChange = (e) => {
    setChordSheet({ ...chordSheet, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    await client.service("chordSheets").patch(id, chordSheet);
    setSaving(false);
    // Optionally show a toast or message
  };

  if (loading) {
    return (
      <ProjectLayout>
        <div className="max-w-3xl mx-auto py-8 px-4">
          <Card className="shadow-lg">
            <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
          </Card>
        </div>
      </ProjectLayout>
    );
  }

  if (!chordSheet) {
    return (
      <ProjectLayout>
        <div className="max-w-3xl mx-auto py-8 px-4">
          <Card className="shadow-lg">
            <div className="text-red-500">Chord sheet not found.</div>
          </Card>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Guitar className="text-indigo-500" size={32} />
            <h1 className="text-2xl font-bold text-indigo-700">Edit Chord Sheet</h1>
          </div>
          <div className="space-y-4">
            <InputText
              name="title"
              value={chordSheet.title}
              onChange={handleChange}
              className="w-full"
              placeholder="Song Title"
            />
            <InputText
              name="artist"
              value={chordSheet.artist}
              onChange={handleChange}
              className="w-full"
              placeholder="Artist"
            />
            <InputText
              name="key"
              value={chordSheet.key}
              onChange={handleChange}
              className="w-full"
              placeholder="Key"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lyrics with Chords</label>
              <textarea
                name="lyricsWithChords"
                value={chordSheet.lyricsWithChords}
                onChange={handleChange}
                rows={10}
                className="w-full border rounded p-2 font-mono"
              />
            </div>
            <Button
              label={saving ? "Saving..." : "Save Changes"}
              icon="pi pi-save"
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            />
          </div>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default ChordEditor;