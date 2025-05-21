/**
 * Major chord voicings for guitar
 * Format: [E, A, D, G, B, E] strings (first item is lowest string)
 * 'x' means string is not played
 */

export const majorChords = {
  'C': [
    {
      id: 'C-major-open',
      position: 'Open Position',
      fingering: ['x', 3, 2, 0, 1, 0],
      fingeringString: 'x32010',  
      suggested_fingers: [0, 3, 2, 0, 1, 0],
      difficulty: 'beginner'
    },
    {
      id: 'C-major-barre',
      position: '3rd Position (A Shape)',
      fingering: ['x', 3, 5, 5, 5, 3],
      fingeringString: 'x35553',  
      suggested_fingers: [0, 1, 3, 4, 4, 1],
      difficulty: 'intermediate' 
    }
  ],
  'D': [
    {
      id: 'D-major-open',
      position: 'Open Position',
      fingering: ['x', 'x', 0, 2, 3, 2],
      fingeringString: 'xx0232',  
      suggested_fingers: [0, 0, 0, 1, 3, 2],
      difficulty: 'beginner'
    },
    {
      id: 'D-major-barre',
      position: '5th Position (A Shape)',
      fingering: ['x', 5, 7, 7, 7, 5],
      fingeringString: 'x57775',  
      suggested_fingers: [0, 1, 3, 4, 4, 1],
      difficulty: 'intermediate'
    }
  ],
  'E': [
    {
      id: 'E-major-open',
      position: 'Open Position',
      fingering: [0, 2, 2, 1, 0, 0],
      fingeringString: '022100',  
      suggested_fingers: [0, 2, 3, 1, 0, 0],
      difficulty: 'beginner'
    },
    {
      id: 'E-major-barre',
      position: '7th Position (A Shape)',
      fingering: ['x', 7, 9, 9, 9, 7],
      fingeringString: 'x79997',  
      suggested_fingers: [0, 1, 3, 4, 4, 1],
      difficulty: 'intermediate'
    }
  ],
  'F': [
    {
      id: 'F-major-barre',
      position: '1st Position (E Shape)',
      fingering: [1, 3, 3, 2, 1, 1],
      fingeringString: '133211',  
      suggested_fingers: [1, 3, 4, 2, 1, 1],
      difficulty: 'intermediate'
    },
    {
      id: 'F-major-alt',
      position: 'Alternative Position',
      fingering: ['x', 'x', 3, 2, 1, 1],
      fingeringString: 'xx3211',  
      suggested_fingers: [0, 0, 3, 2, 1, 1],
      difficulty: 'beginner'
    }
  ],
  'G': [
    {
      id: 'G-major-open',
      position: 'Open Position',
      fingering: [3, 2, 0, 0, 0, 3],
      fingeringString: '320003',  
      suggested_fingers: [2, 1, 0, 0, 0, 3],
      difficulty: 'beginner'
    },
    {
      id: 'G-major-alt',
      position: 'Alternative Position',
      fingering: [3, 2, 0, 0, 3, 3],
      fingeringString: '320033',  
      suggested_fingers: [2, 1, 0, 0, 3, 4],
      difficulty: 'beginner'
    }
  ],
  'A': [
    {
      id: 'A-major-open',
      position: 'Open Position',
      fingering: ['x', 0, 2, 2, 2, 0],
      fingeringString: 'x02220',  
      suggested_fingers: [0, 0, 1, 2, 3, 0],
      difficulty: 'beginner'
    },
    {
      id: 'A-major-barre',
      position: '5th Position (E Shape)',
      fingering: [5, 7, 7, 6, 5, 5],
      fingeringString: '577655',  
      suggested_fingers: [1, 3, 4, 2, 1, 1],
      difficulty: 'intermediate'
    }
  ],
  'B': [
    {
      id: 'B-major-open',
      position: '2nd Position (A Shape)',
      fingering: ['x', 2, 4, 4, 4, 2],
      fingeringString: 'x24442',  
      suggested_fingers: [0, 1, 3, 4, 4, 1],
      difficulty: 'intermediate'
    },
    {
      id: 'B-major-barre',
      position: '7th Position (E Shape)',
      fingering: [7, 9, 9, 8, 7, 7],
      fingeringString: '799877',  
      suggested_fingers: [1, 3, 4, 2, 1, 1],
      difficulty: 'intermediate'
    }
  ]
};