import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Chip } from 'primereact/chip';
import { Divider } from 'primereact/divider';
import { ToggleButton } from 'primereact/togglebutton';
import { Badge } from 'primereact/badge';
import { Chord, Note } from 'tonal';
import { Fretboard } from '@moonwave99/fretboard.js';
import { 
  Search, 
  Guitar, 
  Star, 
  StarHalf, 
  BookmarkPlus,
  Music, 
  Info,
  Bookmark,
  PlayCircle,
  Filter,
  Heart
} from 'lucide-react';
import ProjectLayout from "../Layouts/ProjectLayout";

// Import chord data directly
import { majorChords } from '../../data/chords/major';
import { minorChords } from '../../data/chords/minor';

const ChordLibrary = () => {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [allChords, setAllChords] = useState([]);
  const [filteredChords, setFilteredChords] = useState([]);
  const [groupedChords, setGroupedChords] = useState({});
  const [activeRootIndex, setActiveRootIndex] = useState(0);
  const [showBeginnerOnly, setShowBeginnerOnly] = useState(false);
  
  // References for fretboard rendering
  const fretboardContainerRefs = useRef({});
  const fretboardInstances = useRef({});
  
  // Chord data object - combine imported chord types
  const chordLibrary = {
    major: majorChords,
    minor: minorChords
  };

  // Reset refs when filtered chords change
  useEffect(() => {
    console.log("Filtered chords changed, resetting refs");
    // Clear the existing refs to prevent stale references
    fretboardContainerRefs.current = {};
    fretboardInstances.current = {};
  }, [filteredChords]);
  
  // Load all chord voicings on initial load
  useEffect(() => {
    const loadedChords = [];
    
    // Process all chords from the library
    Object.entries(chordLibrary).forEach(([type, rootsMap]) => {
      Object.entries(rootsMap).forEach(([root, voicings]) => {
        // Enhance the chord data with symbol, type, and name for display
        const enhancedVoicings = voicings.map(voicing => ({
          ...voicing,
          root,
          type,
          symbol: `${root}${type === 'major' ? '' : 'm'}`,
          name: `${root} ${type === 'major' ? 'Major' : 'Minor'}`
        }));
        
        loadedChords.push(...enhancedVoicings);
      });
    });
    
    setAllChords(loadedChords);
    setFilteredChords(loadedChords);
    
    // Group chords by root note
    const grouped = groupChordsByRoot(loadedChords);
    setGroupedChords(grouped);
  }, []);
  
  // Group chords by root note
  const groupChordsByRoot = (chords) => {
    const grouped = {};
    
    chords.forEach(chord => {
      if (!grouped[chord.root]) {
        grouped[chord.root] = [];
      }
      grouped[chord.root].push(chord);
    });
    
    return grouped;
  };
  
  // Filter chords when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredChords(allChords);
      setGroupedChords(groupChordsByRoot(allChords));
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = allChords.filter(chord => 
        chord.name.toLowerCase().includes(term) || 
        chord.position.toLowerCase().includes(term) ||
        chord.type.toLowerCase().includes(term) ||
        chord.root.toLowerCase().includes(term) ||
        (chord.difficulty && chord.difficulty.toLowerCase().includes(term))
      );
      setFilteredChords(filtered);
      setGroupedChords(groupChordsByRoot(filtered));
    }
  }, [searchTerm, allChords]);
  
  // Create fretboard visualizations when active section or tab changes
  useEffect(() => {
    console.log("Rendering fretboards for active root index:", activeRootIndex);
    
    // Add a slight delay to ensure DOM elements are fully rendered
    const timeoutId = setTimeout(() => {
      console.log("Delayed rendering starting...");
      
      // Get all visible chord containers
      Object.keys(fretboardContainerRefs.current).forEach(id => {
        const container = fretboardContainerRefs.current[id];
        if (!container) {
          console.log(`Container ${id} not found, skipping`);
          return;
        }
        
        // Find the chord data by matching full ID, not just part of it
        const chordId = id.replace('fretboard-', '');
        const chordData = filteredChords.find(c => c.id === chordId);
        
        if (!chordData) {
          console.log(`No chord data for ${chordId}, skipping`);
          return;
        }
        
        console.log(`Found chord data for ${chordId}, rendering fretboard`);
        
        // Clear existing fretboard before creating a new one
        if (fretboardInstances.current[id]) {
          try {
            // Check if the container still has child elements
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
            // Remove reference to old instance
            fretboardInstances.current[id] = null;
          } catch (error) {
            console.error("Error cleaning up old fretboard:", error);
          }
        }
        
        try {
          // Create new fretboard
          const fretboard = new Fretboard({
            el: `#${id}`,
            width: 280,
            height: 200,
            fretCount: 5,
            stringCount: 6,
            showFretNumbers: true,
            showTuning: true,
            defaultDots: [],
            dotSize: 25,
            dotText: '',
          });
          
          // Use the fingeringString property to render the chord if available
          if (chordData.fingeringString) {
            fretboard.renderChord(chordData.fingeringString);
          } else {
            // Fallback to the old method
            fretboard.setDots(chordData.fingering.map((fret, stringIndex) => ({
              string: stringIndex + 1,
              fret: fret === 'x' ? 'x' : parseInt(fret, 10),
              note: fret === 'x' ? 'x' : Note.pitchClass(Note.fromMidi(Note.midi('E2') + stringIndex * 5 + parseInt(fret, 10))),
            })));
          }
          
          console.log('Rendered fretboard for:', chordData.name);
          fretboard.render();
          fretboardInstances.current[id] = fretboard;
        } catch (error) {
          console.error(`Error rendering fretboard for ${chordId}:`, error);
        }
      });
    }, 300); 
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      
      // Clean up all fretboard instances when component unmounts or dependencies change
      Object.keys(fretboardInstances.current).forEach(id => {
        const instance = fretboardInstances.current[id];
        if (instance) {
          const container = fretboardContainerRefs.current[id];
          if (container) {
            // Manual cleanup of DOM elements
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
          }
        }
      });
    };
  }, [activeRootIndex, filteredChords, activeTab]);
  
  // Templates for card rendering
  const chordTemplate = (chord) => {
    // Use the chord's full ID for the container ID
    const containerId = `fretboard-${chord.id}`;
    
    // Log the container ID being created for debugging
    console.log(`Creating container with ID: ${containerId}`);
    
    // Determine if this is a beginner-friendly chord
    const isBeginnerFriendly = chord.difficulty === 'beginner';
    
    return (
      <Card 
        className="m-2 p-0 shadow-md hover:shadow-lg transition-shadow"
        style={{ width: 300 }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-xl">{chord.name}</div>
            {isBeginnerFriendly && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Beginner
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            <div>Position: {chord.position}</div>
            <div>Chord ID: {chord.id}</div> {/* Add this line for debugging */}
            {chord.difficulty && (
              <div className="mt-1">
                Difficulty: 
                <span className={chord.difficulty === 'beginner' ? 'text-green-600' : 
                              chord.difficulty === 'intermediate' ? 'text-orange-500' : 'text-red-500'}>
                  {' ' + chord.difficulty.charAt(0).toUpperCase() + chord.difficulty.slice(1)}
                </span>
              </div>
            )}
          </div>
          
          <div 
            id={containerId} 
            ref={el => {
              console.log(`Setting ref for ${containerId}`, el);
              fretboardContainerRefs.current[containerId] = el;
            }}
            className="fretboard-container border border-gray-100 rounded-lg"
            style={{ height: 220 }}
          ></div>
          
          <div className="mt-3 text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                <span>Root Note</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full border border-green-600 mr-1"></div>
                <span>Open String</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full border border-red-600 mr-1 flex items-center justify-center">×</div>
                <span>Muted</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              icon="pi pi-bookmark" 
              className="p-button-rounded p-button-text p-button-sm" 
              tooltip="Save to favorites"
            />
            <Button 
              icon="pi pi-info-circle" 
              className="p-button-rounded p-button-text p-button-sm ml-2" 
              tooltip="Chord details"
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <ProjectLayout>
      <div className="chord-library p-4">
        <h1 className="text-2xl font-bold mb-6">Guitar Chord Library</h1>
        
        <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
          <TabPanel header="Explore Chords">
            <div className="p-grid p-fluid mb-4 flex flex-wrap gap-4">
              <div className="w-full md:w-64">
                <label htmlFor="chordSearch" className="block mb-1 font-medium">Search</label>
                <span className="p-input-icon-left w-full">
                  <Search size={18} />
                  <InputText
                    id="chordSearch"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search root, type, position..."
                    className="w-full"
                  />
                </span>
              </div>
            </div>
            
            <div className="chord-results mt-6">
              <h2 className="text-lg font-medium mb-3">Showing {filteredChords.length} chord voicings</h2>
              
              <Accordion 
                activeIndex={activeRootIndex}
                onTabChange={(e) => {
                  console.log("Accordion tab changed to index:", e.index);
                  setActiveRootIndex(e.index);
                }}
                className="chord-root-accordion"
                expandIcon="pi pi-chevron-down"
                collapseIcon="pi pi-chevron-up"
              >
                {Object.entries(groupedChords).sort().map(([root, chords], index) => (
                  <AccordionTab 
                    key={root} 
                    header={
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xl font-semibold">{root}</span>
                        <span className="text-sm font-normal text-gray-500">
                          {chords.length} voicings
                        </span>
                      </div>
                    }
                  >
                    <div className="p-2">
                      {/* Group chords by type within each root */}
                      {(() => {
                        const byType = {};
                        chords.forEach(chord => {
                          if (!byType[chord.type]) {
                            byType[chord.type] = [];
                          }
                          byType[chord.type].push(chord);
                        });
                        
                        return Object.entries(byType).map(([type, typeChords]) => (
                          <div key={type} className="mb-6">
                            <h3 className="text-lg font-medium mb-3">
                              {type === 'major' ? 'Major' : 'Minor'}
                            </h3>
                            
                            <div className="flex flex-wrap">
                              {typeChords.map(chord => (
                                <div key={chord.id} className="chord-card">
                                  {chordTemplate(chord)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </AccordionTab>
                ))}
              </Accordion>
              
              {Object.keys(groupedChords).length === 0 && (
                <div className="p-4 text-center">
                  <p>No chord voicings found. Try a different search term.</p>
                </div>
              )}
            </div>
          </TabPanel>
          
          <TabPanel header="Favorites">
            <div className="p-4 text-center">
              <h3 className="mb-3">Your saved chords will appear here</h3>
              <p className="text-gray-600">Browse chords and click the bookmark icon to save them to your favorites</p>
            </div>
          </TabPanel>
          
          <TabPanel header="Chord Progressions">
            <div className="p-4 text-center">
              <h3 className="mb-3">Create and save chord progressions</h3>
              <p className="text-gray-600">This feature will allow you to build and practice chord progressions (Coming soon)</p>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </ProjectLayout>
  );
};

export default ChordLibrary;