// Factor tree sizing constants
export const FACTOR_TREE_CONSTANTS = {
  // Base sizes
  BASE_BOX_SIZE: 60,
  BASE_FONT_SIZE: 18,
  BASE_PADDING: 6,
  
  // Scaling ratios
  CHILD_BOX_RATIO: 0.8, // Child boxes are 80% of parent
  CHILD_FONT_RATIO: 0.8, // Child font is 80% of parent
  CHILD_PADDING_RATIO: 0.8, // Child padding is 80% of parent
  ASPECT_RATIO: 3 / 2,
  MIN_ASPECT_RATIO: 5 / 6,
  
  // Spacing ratios (as percentage of parent box size)
  GAP_PERCENT: 0.1,

  // Screen resizing
  PERCENT_OF_SCREEN: 0.95,
  
  // Minimum sizes
  MIN_BOX_SIZE: 40,
  MIN_FONT_SIZE: 12,
  MIN_PADDING: 4,
  
  // Line styling
  LINE_STROKE_WIDTH: 1,
  LINE_ANIMATION_DURATION: 0.6,
} as const;

// Game difficulty levels
export const GAME_DIFFICULTY = {
  EASY: [12, 16, 20, 24, 28, 32, 36, 40, 44, 48],
  MEDIUM: [84, 100, 120, 150, 180, 200, 225, 250, 300, 350],
  HARD: [420, 500, 600, 720, 840, 900, 1000, 1200, 1500, 1800],
} as const;

export type DifficultyLevel = keyof typeof GAME_DIFFICULTY; 