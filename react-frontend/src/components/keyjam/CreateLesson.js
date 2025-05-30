import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Book, Youtube, Check, X, ArrowLeft } from 'lucide-react';
import ProjectLayout from '../Layouts/ProjectLayout';
import client from '../../services/restClient';

const CreateLesson = (props) => {
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState({
    title: '',
    category: '',
    youtubeUrl: '',
    content: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const categories = [
    { label: 'Guitar', value: 'Guitar' },
    { label: 'Piano', value: 'Piano' },
    { label: 'Theory', value: 'Theory' },
    { label: 'Vocals', value: 'Vocals' },
    { label: 'Drums', value: 'Drums' },
    { label: 'Bass', value: 'Bass' },
    { label: 'Other', value: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLesson(prevLesson => ({
      ...prevLesson,
      [name]: value
    }));
  };

  const handleEditorChange = (content) => {
    setLesson(prevLesson => ({
      ...prevLesson,
      content
    }));
  };

  const handleCategoryChange = (e) => {
    setLesson(prevLesson => ({
      ...prevLesson,
      category: e.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Validate all fields
    if (!lesson.title || !lesson.category || !lesson.youtubeUrl || !lesson.content) {
      toast.current.show({ severity: 'error', summary: 'Validation Error', detail: 'Please fill in all required fields', life: 3000 });
      return;
    }

    // YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    if (!youtubeRegex.test(lesson.youtubeUrl)) {
      toast.current.show({ severity: 'error', summary: 'Invalid YouTube URL', detail: 'Please enter a valid YouTube video URL', life: 3000 });
      return;
    }

    setLoading(true);
    props.show && props.show();
    
    const lessonData = {
      ...lesson,
      createdBy: props.user?._id,
      updatedBy: props.user?._id
    };

    client.service('lessons')
      .create(lessonData)
      .then(result => {
        props.hide && props.hide();
        setLoading(false);
        props.alert({ severity: 'success', summary: 'Success', detail: 'Lesson created successfully' });
        navigate(`/keyjam/lessons/${result._id}`);
      })
      .catch(error => {
        console.error('Error creating lesson:', error);
        props.hide && props.hide();
        setLoading(false);
        props.alert({ severity: 'error', summary: 'Error', detail: 'Failed to create lesson' });
      });
  };

  const getYoutubeEmbedUrl = () => {
    if (!lesson.youtubeUrl) return null;
    
    let videoId = null;
    
    // Extract video ID from different YouTube URL formats
    const match = lesson.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl();

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="container mx-auto px-4">
        <div className="py-6 mb-4 text-left">
          <h1 className="text-3xl font-bold text-gray-800 ">
            Create Lesson
          </h1>
          <p className="text-gray-500">Share your musical knowledge with others</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Field */}
          <div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
            <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700">
              Title
            </label>
            <InputText
              id="title"
              name="title"
              value={lesson.title}
              onChange={handleInputChange}
              className={classNames('w-full border-gray-300', { 'p-invalid': submitted && !lesson.title })}
              placeholder="What's your lesson about?"
            />
            {submitted && !lesson.title && <small className="text-red-500">Required</small>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Category Field */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <label htmlFor="category" className="block text-left text-sm font-medium text-gray-700">
                Category
              </label>
              <Dropdown
                id="category"
                name="category"
                value={lesson.category}
                options={categories}
                onChange={handleCategoryChange}
                className={classNames('w-full border-gray-300', { 'p-invalid': submitted && !lesson.category })}
                placeholder="Select category"
              />
              {submitted && !lesson.category && <small className="text-red-500">Required</small>}
            </div>

            {/* YouTube URL */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <label htmlFor="youtubeUrl" className="block text-left text-sm font-medium text-gray-700">
                YouTube URL
              </label>
              <div className="p-input-icon-left w-full">
                <Youtube size={16} className="text-gray-400" />
                <InputText
                  id="youtubeUrl"
                  name="youtubeUrl"
                  value={lesson.youtubeUrl}
                  onChange={handleInputChange}
                  className={classNames('w-full pl-8 border-gray-300', { 'p-invalid': submitted && !lesson.youtubeUrl })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              {submitted && !lesson.youtubeUrl && <small className="text-red-500">Required</small>}
            </div>
          </div>

          {/* YouTube Preview */}
          <div className="border border-gray-100 bg-gray-50 rounded-lg overflow-hidden mx-auto max-w-2xl">
            {embedUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={embedUrl}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video w-full flex items-center justify-center">
                <div className="text-center p-6">
                  <Youtube size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-400 text-sm">Enter a valid YouTube URL to see preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-left text-sm font-medium text-gray-700">
              Lesson Content
            </label>
            <Editor
              id="content"
              value={lesson.content}
              onTextChange={(e) => handleEditorChange(e.htmlValue)}
              style={{ height: '320px' }}
              className={classNames('border rounded-lg overflow-hidden', { 'border-red-300': submitted && !lesson.content })}
            />
            {submitted && !lesson.content && <small className="text-red-500">Required</small>}
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="button"
              label="Cancel"
              className="p-button-text mr-3 text-gray-600"
              onClick={() => navigate('/keyjam/lessons')}
            />
            <Button
              type="submit"
              label={loading ? 'Creating...' : 'Create Lesson'}
              icon={loading ? null : <Check size={16} className="mr-1" />}
              loading={loading}
              className="bg-indigo-600 hover:bg-indigo-700 border-indigo-600"
            />
          </div>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateLesson);