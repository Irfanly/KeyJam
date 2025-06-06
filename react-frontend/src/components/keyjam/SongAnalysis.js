import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import client from "../../services/restClient";
import ProjectLayout from "../Layouts/ProjectLayout";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FileAudio, Music, ArrowLeft, AudioWaveform } from "lucide-react";

const SongAnalysis = () => {
  const { singleSongAnalysisId } = useParams();
  const [analysisDoc, setAnalysisDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    client
      .service("songAnalysis")
      .get(singleSongAnalysisId)
      .then((data) => {
        setAnalysisDoc(data);
        setLoading(false);
      })
      .catch((err) => {
        if (toast.current) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message || "Failed to load song analysis",
            life: 3000,
          });
        }
        setLoading(false);
      });
  }, [singleSongAnalysisId]);

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      {loading ? (
        <div className="max-w-xl mx-auto py-10">
          <Card>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        </div>
      ) : !analysisDoc ? (
        <div className="max-w-xl mx-auto py-10">
          <Card>
            <div className="text-center text-gray-500 py-10">
              <Music size={32} className="mx-auto mb-2" />
              <div className="mb-4">Song analysis not found.</div>
              <Button
                label="Back"
                icon={<ArrowLeft size={16} />}
                className="p-button-text"
                onClick={() => navigate(-1)}
              />
            </div>
          </Card>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-10">
          <Card className="shadow-lg border-0">
            <div className="flex items-center gap-3 mb-6">
              <AudioWaveform size={28} className="text-indigo-500" />
              <h2 className="text-2xl font-semibold text-gray-800 flex-1">{analysisDoc.title}</h2>
              <Button
                icon={<ArrowLeft size={18} />}
                className="p-button-text"
                onClick={() => navigate(-1)}
                tooltip="Back"
                tooltipOptions={{ position: "bottom" }}
              />
            </div>
            <div className="mb-2 text-gray-700 flex items-center gap-2">
              <Music size={16} className="text-indigo-400" />
              <span className="font-medium">{analysisDoc.artist}</span>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <FileAudio size={16} className="text-amber-500" />
              <a
                href={analysisDoc.audioFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-700 underline"
              >
                {analysisDoc.audioFileName}
              </a>
              <span className="text-xs text-gray-400 ml-2">{new Date(analysisDoc.createdAt).toLocaleString()}</span>
            </div>
            <div className="divide-y divide-gray-100">
              <Section label="Melody" value={analysisDoc.analysis?.melody} />
              <Section label="Harmony" value={analysisDoc.analysis?.harmony} />
              <Section label="Rhythm" value={analysisDoc.analysis?.rhythm} />
              <Section label="Arrangement" value={analysisDoc.analysis?.arrangement} />
              <Section label="Mood" value={analysisDoc.analysis?.mood} />
              <Section label="Genre" value={analysisDoc.analysis?.genre} />
              <Section label="Composition Score" value={analysisDoc.analysis?.compositionScore != null ? `${analysisDoc.analysis.compositionScore}/100` : "-"} />
              <Section label="Suggestions" value={analysisDoc.analysis?.suggestions} />
            </div>
            <div className="mt-6 text-xs text-gray-400">
              <div>User ID: {analysisDoc.userId}</div>
              <div>Created By: {analysisDoc.createdBy}</div>
              <div>Updated By: {analysisDoc.updatedBy}</div>
            </div>
          </Card>
        </div>
      )}
    </ProjectLayout>
  );
};

function Section({ label, value }) {
  return (
    <div className="py-4">
      <div className="text-xs uppercase text-gray-400 font-semibold mb-1">{label}</div>
      <div className="text-gray-800">{value || <span className="text-gray-300">-</span>}</div>
    </div>
  );
}

const mapToState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapToDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapToState, mapToDispatch)(SongAnalysis);