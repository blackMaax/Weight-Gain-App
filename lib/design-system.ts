/**
 * Centralized Design System
 * 
 * This file defines all design tokens used throughout the app.
 * Use these constants instead of hardcoded values for consistency.
 */

// ============================================
// COLOR PALETTE
// ============================================
export const colors = {
  // Primary Palette
  darkRed: '#780000',
  brightRed: '#C1121F',
  cream: '#FDF0D5',
  darkBlue: '#003049',
  lightBlue: '#669BBC',
  
  // Semantic Colors
  background: '#FDF0D5',
  foreground: '#003049',
  card: '#FFFFFF',
  cardForeground: '#003049',
  border: '#E0E0E0',
  input: '#FFFFFF',
  
  // Status Colors
  primary: '#C1121F',
  primaryHover: '#780000',
  secondary: '#669BBC',
  secondaryHover: '#003049',
  success: '#669BBC',
  warning: '#C1121F',
  error: '#C1121F',
  
  // Text Colors
  textPrimary: '#003049',
  textSecondary: '#669BBC',
  textMuted: '#669BBC',
  textInverse: '#FDF0D5',
  
  // Interactive States
  hover: '#FDF0D5',
  active: '#C1121F',
  disabled: '#E0E0E0',
} as const

// ============================================
// SPACING SCALE
// ============================================
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
} as const

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  // Font Families
  fontSans: "'Geist', 'Geist Fallback', system-ui, sans-serif",
  fontMono: "'Geist Mono', 'Geist Mono Fallback', monospace",
  
  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.02em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  none: '0',
  sm: '0.5rem',      // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  full: '9999px',
} as const

// ============================================
// SHADOWS
// ============================================
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
} as const

// ============================================
// BREAKPOINTS (for reference)
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================
// Z-INDEX SCALE
// ============================================
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  navigation: 50, // Bottom nav
} as const

// ============================================
// COMPONENT SPECIFIC TOKENS
// ============================================
export const components = {
  // Cards
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.card,
    borderColor: colors.border,
    shadow: shadows.md,
  },
  
  // Buttons
  button: {
    padding: {
      sm: `${spacing.sm} ${spacing.md}`,
      md: `${spacing.md} ${spacing.lg}`,
      lg: `${spacing.lg} ${spacing.xl}`,
    },
    borderRadius: borderRadius.lg,
    fontWeight: typography.fontWeight.semibold,
    transition: transitions.normal,
  },
  
  // Inputs
  input: {
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.lg,
    borderColor: colors.border,
    backgroundColor: colors.input,
  },
  
  // Navigation
  navigation: {
    height: '4rem', // 64px
    padding: spacing.sm,
  },
} as const

// ============================================
// UTILITY FUNCTIONS
// ============================================
export const designSystem = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  components,
} as const

// Export for use in components
export default designSystem


