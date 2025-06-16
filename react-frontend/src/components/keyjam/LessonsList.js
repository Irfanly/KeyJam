import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Book, Search, Youtube, Music, Filter, Video, Plus, Trash } from 'lucide-react';
import { PrimeIcons } from 'primereact/api';
import ProjectLayout from '../Layouts/ProjectLayout';
import client from '../../services/restClient';

const LessonsList = (props) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [categories, setCategories] = useState([]);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.user?._id) {
      // User not loaded yet, don't fetch
      return;
    }
    props.show && props.show();
    
    client.service('lessons')
      .find({
        query: {
          $limit: 100,
          $sort: { createdAt: -1 },
          $populate: [{ path: 'createdBy', select: ['name'] }]
        }
      })
      .then(result => {
        setLessons(result.data || []);
        console.log('Fetched lessons:', result.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(result.data.map(lesson => lesson.category))];
        setCategories(uniqueCategories.map(cat => ({ label: cat, value: cat })));
        props.hide && props.hide();
      })
      .catch(error => {
        console.error('Error fetching lessons:', error);
        props.hide && props.hide();
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to load lessons', 
          life: 3000 
        });
      });
      
      setLoading(false);
  }, [props.user?._id]);

  const viewLesson = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  const deleteLesson = (lessonId) => {
    client.service('lessons')
      .remove(lessonId)
      .then(() => {
        setLessons(lessons.filter(lesson => lesson._id !== lessonId));
        toast.current.show({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Lesson deleted successfully', 
          life: 3000 
        });
      })
      .catch(error => {
        console.error('Error deleting lesson:', error);
        toast.current.show({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to delete lesson', 
          life: 3000 
        });
      });
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'guitar':
        return <Music size={18} />;
      case 'piano':
        return <Music size={18} />;
      case 'theory':
        return <Book size={18} />;
      case 'vocals':
        return <Music size={18} />;
      case 'drums':
        return <Music size={18} />;
      case 'bass':
        return <Music size={18} />;
      case 'other':
        return <Video size={18} />;
      default:
        return <Video size={18} />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'guitar':
        return 'warning';
      case 'piano':
        return 'info';
      case 'theory':
        return 'success';
      case 'vocals':
        return 'danger';
      case 'drums':
        return 'primary';
      case 'bass':
        return 'secondary';
      case 'other':
        return 'help';
      default:
        return 'secondary';
    }
  };

  const filteredLessons = lessons
    .filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || lesson.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

  const renderHeader = () => {
    return (
      <div className="flex flex-column md:flex-row md:justify-between md:items-center">
        <div className="mb-3 md:mb-0 flex items-center">
          <h2 className="text-2xl font-bold text-gray-800 m-0 flex items-center">
            <Book size={24} className="mr-2 text-indigo-600" />
            Music Lessons
          </h2>
        </div>

        <div className="flex flex-column md:flex-row gap-3">

        {/* Suppose to only be visible to admin */}
          <button
            onClick={() => navigate('/lessons/create')}
            className="p-button p-button-success flex align-items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Lesson</span>
          </button>
      
          <div className="p-inputgroup w-full md:w-20rem">
            <span className="p-inputgroup-addon">
              <Search size={18} />
            </span>
            <InputText 
              placeholder="Search lessons..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <Dropdown
            value={categoryFilter}
            options={[{ label: 'All Categories', value: null }, ...categories]}
            onChange={(e) => setCategoryFilter(e.value)}
            placeholder="Filter by Category"
            className="w-full md:w-12rem"
          />
        </div>
      </div>
    );
  };

  const itemTemplate = (lesson) => {
    return (
      <div className="mb-4">
        <div 
          className="bg-white border border-gray-200 container rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => viewLesson(lesson._id)}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left side - YouTube thumbnail with overlay */}
            <div className="md:w-1/4 relative">
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent z-10"></div>
                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                  {lesson.youtubeUrl ? (
                    <img
                      src={`https://img.youtube.com/vi/${lesson.youtubeUrl.split('v=')[1].split('&')[0]}/hqdefault.jpg`}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No thumbnail available</div>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 z-20">
                  <div className="flex items-center bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    <Youtube size={14} className="mr-1" />
                    <span>Video Lesson</span>
                  </div>
                </div>
                <div className="absolute top-2 right-2 z-20">
                  <Tag 
                    value={lesson.category} 
                    severity={getCategoryColor(lesson.category)}
                    icon={getCategoryIcon(lesson.category)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - Lesson details */}
            <div className="md:w-3/4 p-4 md:p-5 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-left text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {lesson.title}
                </h3>
                
                <p className="text-gray-600 text-sm line-clamp-3 text-justify">
                  {lesson.content ? (
                    <span dangerouslySetInnerHTML={{ 
                      __html: lesson.content.replace(/<[^>]*>/g, ' ').substring(0, 250) + (lesson.content.length > 250 ? '...' : '')
                    }} />
                  ) : (
                    "Click to view this lesson"
                  )}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium border border-indigo-200">
                    {lesson.createdBy?.name?.charAt(0) || '?'}
                  </div>
                  <div className="ml-2">
                    <span className="block text-sm font-medium text-gray-700">
                      {lesson.createdBy?.name || 'Unknown Author'}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {new Date(lesson.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {props.user && lesson.createdBy === props.user._id && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the viewLesson function
                      if(window.confirm('Are you sure you want to delete this lesson?')) {
                        deleteLesson(lesson._id);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="p-4 md:p-6 min-h-screen">
        <div className="container mx-auto">
          {renderHeader()}
          
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
              </div>
            ) : (
              filteredLessons.length > 0 ? (
                <DataView
                  value={filteredLessons}
                  itemTemplate={itemTemplate}
                  layout="list"
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
                  {searchTerm || categoryFilter ? (
                    // No results from search/filter
                    <>
                      <Search size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No lessons match your filters</h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        We couldn't find any lessons matching your current search or category filter.
                      </p>
                      <div className="flex justify-center gap-3 mt-2">
                        <button 
                          onClick={() => {setSearchTerm(''); setCategoryFilter(null);}}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                          <Filter size={16} />
                          Clear Filters
                        </button>
                      </div>
                    </>
                  ) : (
                    // No lessons at all
                    <>
                      <Book size={48} className="mx-auto mb-4 text-indigo-400" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">No lessons available yet</h3>
                      <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        There are currently no lessons in our library. Check back soon as we're constantly adding new content!
                      </p>
                      <div className="flex justify-center gap-3 mt-2">
                        <button 
                          onClick={() => navigate('/lessons/create')}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Create New Lesson
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </ProjectLayout>
  )
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

export default connect(mapStateToProps, mapDispatchToProps)(LessonsList);