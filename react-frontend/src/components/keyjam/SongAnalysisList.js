import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import client from "../../services/restClient";
import ProjectLayout from "../Layouts/ProjectLayout";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Music, CalendarDays, User2, Plus, Trash2 } from "lucide-react";

const SongAnalysisList = (props) => {
  const [loading, setLoading] = useState(true);
  const [songAnalyses, setSongAnalyses] = useState([]);
  const navigate = useNavigate();
  const toast = useRef(null);

  const fetchData = async () => {
    props.show();
    const userId = props.user._id;
    try {
      const result = await client.service("songAnalysis").find({
        query: {
          createdBy: userId,
          $limit: 100,
          $sort: { updatedAt: -1 },
          $populate: [{ path: "createdBy", service: "users", select: ["name"] }]
        }
      });
      setSongAnalyses(result.data || []);
      setLoading(false);
    } catch (error) {
      props.alert({
        type: "error",
        title: "Error",
        message: "Failed to load your song analyses"
      });
    } finally {
      props.hide();
    }
  };

  useEffect(() => {
    if (!props.user?._id) return;
    fetchData();
    // eslint-disable-next-line
  }, [props.user]);

  const handleCreate = () => {
    navigate("/songAnalysis/create");
  };

  const handleClick = (analysisId) => {
    navigate(`/songAnalysis/${analysisId}`);
  };

  const handleDelete = async (analysisId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this analysis?")) {
      return;
    }
    props.show();
    try {
      await client.service("songAnalysis").remove(analysisId);
      setSongAnalyses(songAnalyses.filter(a => a._id !== analysisId));
      props.alert({
        type: "success",
        title: "Deleted",
        message: "Analysis deleted successfully"
      });
    } catch (error) {
      props.alert({
        type: "error",
        title: "Error",
        message: "Failed to delete analysis"
      });
    } finally {
      props.hide();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Music size={24} className="text-indigo-500" />
            Your Song Analyses
          </h2>
          <Button
            label="New Analysis"
            icon={<Plus size={16} />}
            className="p-button-sm bg-indigo-600 border-indigo-600"
            onClick={handleCreate}
          />
        </div>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : songAnalyses.length === 0 ? (
          <Card className="shadow text-center py-10">
            <div className="text-gray-400 mb-2">
              <Music size={32} className="mx-auto mb-2" />
              <div>No song analyses found.</div>
            </div>
            <Button
              label="Create your first analysis"
              icon={<Plus size={16} />}
              className="mt-4 bg-indigo-600 border-indigo-600"
              onClick={handleCreate}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {songAnalyses.map((analysis) => (
              <Card
                key={analysis._id}
                className="shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100"
                onClick={() => handleClick(analysis._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <Music size={36} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-800 truncate">{analysis.title}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User2 size={14} /> {analysis.artist || "Unknown Artist"}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} /> {formatDate(analysis.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    icon={<Trash2 size={16} />}
                    className="p-button-rounded p-button-text p-button-danger"
                    onClick={(e) => handleDelete(analysis._id, e)}
                    tooltip="Delete"
                    tooltipOptions={{ position: "bottom" }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
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

export default connect(mapToState, mapToDispatch)(SongAnalysisList);