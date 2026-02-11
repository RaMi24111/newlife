// Color theme constants for RestaurantOS
// Web version - uses CSS custom properties and Tailwind config

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const Themes = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export default Themes;

// Restaurant theme colors (matched with Tailwind config)
export const RestaurantColors = {
  // Royal Maroon Primary
  primary: '#7B1F1F',
  primaryLight: '#9B2B2B',
  primaryDark: '#3B0A0D',
  
  // Royal Gold Accent
  gold: '#C8A951',
  goldLight: '#B8993D',
  
  // Ivory/Cream backgrounds
  ivory: '#FBF6EE',
  
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  
  // Accent colors
  accent: '#f43f5e',
  accentTeal: '#14b8a6',
  accentPurple: '#8b5cf6',
  accentEmerald: '#10b981',
};

// Helper function to get theme colors
export const useThemeColors = (scheme: 'light' | 'dark' = 'light') => {
  return {
    ...Themes[scheme],
    ...RestaurantColors,
  };
};
