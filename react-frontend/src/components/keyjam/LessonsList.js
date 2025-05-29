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
import { Book, Search, Youtube, Music, Filter, Video, Plus } from 'lucide-react';
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
  }, []);

  const viewLesson = (lessonId) => {
    navigate(`/keyjam/lessons/${lessonId}`);
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
            onClick={() => navigate('/keyjam/lessons/new')}
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
      <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
        <Card 
          className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer h-full"
          onClick={() => viewLesson(lesson._id)}
        >
          <div className="flex flex-column h-full">
            <div className="mb-3">
              <Tag 
                value={lesson.category} 
                severity={getCategoryColor(lesson.category)}
                icon={getCategoryIcon(lesson.category)}
              />
            </div>
            
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                {lesson.title}
              </h3>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                  {lesson.createdBy?.name?.charAt(0) || '?'}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {lesson.createdBy?.name || 'Unknown Author'}
                </span>
              </div>
              
              <div className="flex items-center">
                <Youtube size={16} className="mr-1 text-red-500" />
                <span className="text-xs text-gray-500">Video Lesson</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <ProjectLayout>
      <Toast ref={toast} />
      <div className="p-4 md:p-6">
        <div className="max-w-8xl mx-auto">
          {renderHeader()}
          
          <div className="mt-5">
            {filteredLessons.length > 0 ? (
              <DataView
                value={filteredLessons}
                itemTemplate={itemTemplate}
                layout="grid"
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
                    {props.user?.role === 'admin' && (
                      <div className="flex justify-center gap-3 mt-2">
                        <button 
                          onClick={() => navigate('/keyjam/lessons/new')}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Create New Lesson
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
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