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