import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import { ArrowLeft, Clock, Calendar, User, Youtube, MessageCircle } from "lucide-react";
import ProjectLayout from '../Layouts/ProjectLayout';
import client from "../../services/restClient";

const LessonPage = (props) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [creator, setCreator] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const toast = useRef(null);

  const fetchLesson = async() => {
    try {
      setLoading(true);
      const response = await client.service("lessons").get(lessonId);
      
      // Set the lesson data
      setLesson(response);
      
      // Fetch creator information if createdBy is available
      if (response.createdBy) {
        try {
          const userResponse = await client.service("users").get(response.createdBy);
          setCreator(userResponse);
        } catch (userError) {
          console.error("Error fetching creator details:", userError);
        }
      }
      
    } catch(error) {
      console.error("Error fetching lesson:", error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch lesson details.',
        life: 3000
      });
      setError("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!props.user?._id) {
      // User not logged in, don't fetch lesson
      return;
    }

    if(!lessonId) return;
    
    fetchLesson();
    
    return () => {
      isMounted.current = false;
    };
  }, [lessonId, props.user?._id]);

  // Format the created date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Get YouTube embed URL from the stored URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    let videoId = null;
    
    // Extract video ID from different YouTube URL formats
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Show loading skeleton while data is loading
  if (loading) {
    return (
      <ProjectLayout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Skeleton width="100%" height="75px" className="mb-4" />
          <div className="flex gap-4 mb-8">
            <Skeleton shape="circle" width="50px" height="50px" />
            <div className="flex-1">
              <Skeleton width="200px" height="20px" className="mb-2" />
              <Skeleton width="120px" height="15px" />
            </div>
          </div>
          <Skeleton width="100%" height="400px" className="mb-8" />
          <Skeleton width="100%" height="200px" />
        </div>
      </ProjectLayout>
    );
  }

  // Show error message
  if (error) {
    return (
      <ProjectLayout>
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <Card className="shadow-lg border-0">
            <div className="text-red-500 text-xl mb-4">Error Loading Lesson</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              label="Go Back" 
              icon={<ArrowLeft size={16} className="mr-2" />}
              onClick={() => navigate('/keyjam/lessons')}
              className="p-button-outlined"
            />
          </Card>
        </div>
      </ProjectLayout>
    );
  }

  // Show empty state if lesson is not found
  if (!lesson) {
    return (
      <ProjectLayout>
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <Card className="shadow-lg border-0">
            <div className="text-xl font-light mb-4">Lesson Not Found</div>
            <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
            <Button 
              label="Back to Lessons" 
              icon={<ArrowLeft size={16} className="mr-2" />}
              onClick={() => navigate('/keyjam/lessons')}
              className="p-button-outlined"
            />
          </Card>
        </div>
      </ProjectLayout>
    );
  }

  // Get the embed URL for YouTube
  const embedUrl = getYoutubeEmbedUrl(lesson.youtubeUrl);

  return (
    <ProjectLayout>
      <Toast ref={toast} position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeft size={18} />} 
            label="Back to Lessons" 
            className="p-button-text p-button-sm text-gray-700"
            onClick={() => navigate('/keyjam/lessons')} 
          />
        </div>
        
        {/* Lesson title and category */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">{lesson.title}</h1>
          
          <div className="flex items-center flex-wrap gap-3">
            <Tag 
              value={lesson.category || "Uncategorized"} 
              className="bg-indigo-100 text-indigo-800 border-0 px-3 py-2 text-sm" 
              icon={<span className="opacity-70 mr-1">🎵</span>}
            />
            
            <div className="flex items-center text-gray-500 text-sm ml-2">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(lesson.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            {/* YouTube video */}
            {embedUrl && (
              <div className="rounded-xl overflow-hidden bg-black shadow-md">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Lesson content */}
            <Card className="shadow-sm border-0 overflow-hidden">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }}></div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Creator info */}
            <Card className="shadow-sm border-0 mb-6">
              <div className="flex items-start">
                <Avatar 
                  icon={<User size={24} />} 
                  style={{ backgroundColor: '#4F46E5', color: '#ffffff' }}
                  shape="circle"
                  className="mr-3" 
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {creator? creator.name : 'Instructor'}
                  </h3>
                  <p className="text-sm text-gray-500">{creator?.email || 'KeyJam Instructor'}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
}

const mapStateToProps = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatchToProps = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonPage);