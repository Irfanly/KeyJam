/**
 * Minor chord voicings for guitar
 * Format: [E, A, D, G, B, E] strings (first item is lowest string)
 * 'x' means string is not played
 */

export const minorChords = {
  'C': [
    {
      id: 'C-minor-barre',
      position: '3rd Position',
      fingering: [3, 3, 5, 5, 4, 3],
      fingeringString: '335543',  
      suggested_fingers: [1, 1, 3, 4, 2, 1],
      difficulty: 'intermediate'
    },
    {
      id: 'C-minor-alt',
      position: 'Alternative Position',
      fingering: ['x', 3, 5, 5, 4, 3],
      fingeringString: 'x35543',  
      suggested_fingers: [0, 1, 3, 4, 2, 1],
      difficulty: 'intermediate'
    }
  ],
  'D': [
    {
      id: 'D-minor-open',
      position: 'Open Position',
      fingering: ['x', 'x', 0, 2, 3, 1],
      fingeringString: 'xx0231',  
      suggested_fingers: [0, 0, 0, 2, 3, 1],
      difficulty: 'beginner'
    },
    {
      id: 'D-minor-barre',
      position: '5th Position',
      fingering: ['x', 5, 7, 7, 6, 5],
      fingeringString: 'x57765',  
      suggested_fingers: [0, 1, 3, 4, 2, 1],
      difficulty: 'intermediate'
    }
  ],
  'E': [
    {
      id: 'E-minor-open',
      position: 'Open Position',
      fingering: [0, 2, 2, 0, 0, 0],
      fingeringString: '022000',  
      suggested_fingers: [0, 2, 3, 0, 0, 0],
      difficulty: 'beginner'
    },
    {
      id: 'E-minor-barre',
      position: '7th Position',
      fingering: ['x', 7, 9, 9, 8, 7],
      fingeringString: 'x79987',  
      suggested_fingers: [0, 1, 3, 4, 2, 1],
      difficulty: 'intermediate'
    }
  ],
  'F': [
    {
      id: 'F-minor-barre',
      position: '1st Position',
      fingering: [1, 3, 3, 1, 1, 1],
      fingeringString: '133111',  
      suggested_fingers: [1, 3, 4, 1, 1, 1],
      difficulty: 'intermediate'
    },
    {
      id: 'F-minor-alt',
      position: 'Alternative Position',
      fingering: ['x', 'x', 3, 1, 1, 1],
      fingeringString: 'xx3111',  
      suggested_fingers: [0, 0, 3, 1, 1, 1],
      difficulty: 'beginner'
    }
  ],
  'G': [
    {
      id: 'G-minor-barre',
      position: '3rd Position',
      fingering: [3, 5, 5, 3, 3, 3],
      fingeringString: '355333',  
      suggested_fingers: [1, 3, 4, 1, 1, 1],
      difficulty: 'intermediate'
    },
    {
      id: 'G-minor-alt',
      position: 'Alternative Position',
      fingering: ['x', 'x', 5, 3, 3, 3],
      fingeringString: 'xx5333',  
      suggested_fingers: [0, 0, 3, 1, 1, 1], 
      difficulty: 'beginner'
    }
  ],
  'A': [
    {
      id: 'A-minor-open',
      position: 'Open Position',
      fingering: ['x', 0, 2, 2, 1, 0],
      fingeringString: 'x02210',  
      suggested_fingers: [0, 0, 2, 3, 1, 0],
      difficulty: 'beginner'
    },
    {
      id: 'A-minor-barre',
      position: '5th Position',
      fingering: [5, 7, 7, 5, 5, 5],
      fingeringString: '577555',  
      suggested_fingers: [1, 3, 4, 1, 1, 1],
      difficulty: 'intermediate'
    }
  ],
  'B': [
    {
      id: 'B-minor-barre',
      position: '2nd Position',
      fingering: [2, 2, 4, 4, 3, 2],
      fingeringString: '224432',  
      suggested_fingers: [1, 1, 3, 4, 2, 1],
      difficulty: 'intermediate'
    },
    {
      id: 'B-minor-alt',
      position: '7th Position',
      fingering: ['x', 7, 9, 9, 8, 7],
      fingeringString: 'x79987',  
      suggested_fingers: [0, 1, 3, 4, 2, 1],
      difficulty: 'intermediate'
    }
  ]
};