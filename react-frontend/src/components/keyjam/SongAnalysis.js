import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import client from "../../services/restClient";
import ProjectLayout from "../Layouts/ProjectLayout";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { 
  FileAudio, Music, ArrowLeft, AudioWaveform, 
  ListMusic, Clock, Layout, HeartPulse, 
  Music2, Star, Lightbulb
} from "lucide-react";

const SongAnalysis = () => {
  const { singleSongAnalysisId } = useParams();
  const [analysisDoc, setAnalysisDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const toast = useRef(null);
  const audioRef = useRef(null);
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

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <Card className="shadow-lg border-0">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded-full w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/3"></div>
              <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </Card>
        ) : !analysisDoc ? (
          <Card className="shadow-lg border-0">
            <div className="text-center text-gray-500 py-16">
              <Music size={48} className="mx-auto mb-4 text-gray-400" />
              <div className="text-xl mb-6">Song analysis not found</div>
              <Button
                label="Back to Dashboard"
                icon={<ArrowLeft size={18} />}
                className="p-button-rounded p-button-outlined"
                onClick={() => navigate(-1)}
              />
            </div>
          </Card>
        ) : (
          <>
            {/* Header with title and navigation */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <AudioWaveform size={32} className="text-amber-500" />
                <span>Song Analysis</span>
              </h1>
            </div>
            
            {/* Song info card */}
            <Card className="shadow-lg border-0 mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-slate-50 -mx-4 -mt-4 p-6 mb-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{analysisDoc.title}</h2>
                    <div className="text-gray-600 flex items-center gap-2 mt-1">
                      <Music2 size={16} className="text-amber-500" />
                      <span>{analysisDoc.artist}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="composition-score-circle">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-amber-600">
                            {analysisDoc.analysis?.compositionScore || "-"}
                          </span>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            className="circle"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeDasharray={`${analysisDoc.analysis?.compositionScore || 0}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute -bottom-2 left-0 right-0 text-center text-xs text-gray-500">
                          Score
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <div className="mb-1 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                        Genre: <span className="font-medium text-gray-700">{analysisDoc.analysis?.genre || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        {new Date(analysisDoc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Audio player */}
              {analysisDoc.audioFileUrl && (
                <div className="mb-6 p-2 border rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3 mb-2 p-2">
                    <button 
                      onClick={toggleAudioPlayback}
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${audioPlaying ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'}`}>
                      {audioPlaying ? (
                        <div className="w-3 h-8">
                          <div className="w-1 h-8 bg-amber-500 inline-block mx-0.5 animate-pulse"></div>
                          <div className="w-1 h-8 bg-amber-500 inline-block mx-0.5 animate-pulse delay-75"></div>
                        </div>
                      ) : (
                        <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-slate-600 ml-1"></div>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Audio Reference</div>
                      <div className="text-sm font-medium truncate">{analysisDoc.audioFileName}</div>
                    </div>
                    <a 
                      href={analysisDoc.audioFileUrl} 
                      download={analysisDoc.audioFileName}
                      className="text-amber-600 hover:text-amber-700">
                      <span className="sr-only">Download</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                  <audio 
                    ref={audioRef}
                    src={analysisDoc.audioFileUrl}
                    className="w-full h-10" 
                    controls 
                    preload="metadata"
                    onPlay={() => setAudioPlaying(true)}
                    onPause={() => setAudioPlaying(false)}
                    onEnded={() => setAudioPlaying(false)}
                  />
                </div>
              )}
              
              {/* Analysis grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalysisSection 
                  icon={<AudioWaveform className="text-blue-500" />}
                  label="Melody"
                  value={analysisDoc.analysis?.melody}
                  color="blue"
                />
                <AnalysisSection 
                  icon={<ListMusic className="text-indigo-500" />}
                  label="Harmony"
                  value={analysisDoc.analysis?.harmony}
                  color="indigo"
                />
                <AnalysisSection 
                  icon={<Clock className="text-green-500" />}
                  label="Rhythm"
                  value={analysisDoc.analysis?.rhythm}
                  color="green"
                />
                <AnalysisSection 
                  icon={<Layout className="text-purple-500" />}
                  label="Arrangement"
                  value={analysisDoc.analysis?.arrangement}
                  color="purple"
                />
                <AnalysisSection 
                  icon={<HeartPulse className="text-rose-500" />}
                  label="Mood"
                  value={analysisDoc.analysis?.mood}
                  color="rose"
                />
                <AnalysisSection 
                  icon={<Music className="text-amber-500" />}
                  label="Genre"
                  value={analysisDoc.analysis?.genre}
                  color="amber"
                />
              </div>
              
              {/* Suggestions */}
              <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-blue-500" />
                  <h3 className="text-blue-700 font-medium">Improvement Suggestions</h3>
                </div>
                <div className="text-blue-800">
                  {analysisDoc.analysis?.suggestions || "No specific suggestions."}
                </div>
              </div>
              
              <div className="mt-6 text-xs text-gray-400 border-t pt-4">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <div>Reference ID: {singleSongAnalysisId}</div>
                  <div>User ID: {analysisDoc.userId}</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </ProjectLayout>
  );
};

function AnalysisSection({ icon, label, value, color }) {
  return (
    <div className={`p-4 rounded-lg border border-${color}-100 bg-${color}-50`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className={`text-${color}-700 font-medium`}>{label}</h3>
      </div>
      <div className={`text-${color}-900 text-sm`}>{value || <span className="text-gray-300">Not available</span>}</div>
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