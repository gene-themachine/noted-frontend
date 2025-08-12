// API Configuration
export const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Route Constants
export const ROUTES = {
  LANDING: '/',
  HOME: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  //   FORGOT_PASSWORD: '/forgot-password',
  //   RESET_PASSWORD: '/reset-password',
  //   VERIFY_EMAIL: '/verify-email',
  //   VERIFY_EMAIL_TOKEN: '/verify-email-token',
  //   VERIFY_EMAIL_TOKEN_EXPIRED: '/verify-email-token-expired',
};

// Design System Constants
export const DESIGN_TOKENS = {
  // Spacing Scale (following 4px grid system)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    base: '1rem',     // 16px
    md: '1.5rem',     // 24px
    lg: '2rem',       // 32px
    xl: '3rem',       // 48px
    '2xl': '4rem',    // 64px
    '3xl': '6rem',    // 96px
    '4xl': '8rem',    // 128px
  },
  
  // Component Dimensions
  dimensions: {
    header: {
      height: '5rem',     // 80px
      padding: '1.5rem',  // 24px
    },
    sidebar: {
      width: '20rem',     // 320px
      height: '31.25rem', // 500px
      padding: '1.5rem',  // 24px
    },
    button: {
      height: '3rem',     // 48px
      heightLg: '4rem',   // 64px
      padding: '1rem',    // 16px
      paddingLg: '1.5rem', // 24px
    },
    card: {
      padding: '1.5rem',  // 24px
      borderRadius: '1rem', // 16px
      minHeight: '8rem',  // 128px
    },
    modal: {
      padding: '2rem',    // 32px
      borderRadius: '1rem', // 16px
      maxWidth: '32rem',  // 512px
    },
    input: {
      height: '3rem',     // 48px
      padding: '1rem',    // 16px
      borderRadius: '0.5rem', // 8px
    },
  },
  
  // Layout Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Animation Durations
  animation: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  
  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 40,
    overlay: 45,
    modal: 50,
    popover: 55,
    tooltip: 60,
    toast: 70,
    floating: 80,
  },
  
  // Shadow Scale
  shadows: {
    card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    cardHover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    floating: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    floatingLg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// Layout Constants
export const LAYOUT = {
  // Mobile breakpoint for responsive design
  mobileBreakpoint: '1024px', // lg breakpoint
  
  // Container max widths
  maxWidth: {
    content: '64rem',    // 1024px
    sidebar: '20rem',    // 320px
    modal: '32rem',      // 512px
  },
  
  // Responsive spacing multipliers
  spacing: {
    mobile: 1,
    tablet: 1.25,
    desktop: 1.5,
  },
  
  // Grid system
  grid: {
    columns: 12,
    gutter: '1.5rem',   // 24px
    margin: '1rem',     // 16px
  },
};

// Component States
export const COMPONENT_STATES = {
  interactive: {
    default: 'default',
    hover: 'hover',
    focus: 'focus',
    active: 'active',
    disabled: 'disabled',
  },
  
  // Loading states
  loading: {
    idle: 'idle',
    pending: 'pending',
    success: 'success',
    error: 'error',
  },
  
  // Visibility states
  visibility: {
    visible: 'visible',
    hidden: 'hidden',
    collapsed: 'collapsed',
  },
};

// Typography Scale
export const TYPOGRAPHY = {
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

// Color Semantic Mapping
export const SEMANTIC_COLORS = {
  status: {
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0078b9',
  },
  
  interaction: {
    primary: '#000000',
    secondary: '#ff7800',
    accent: '#0078b9',
    neutral: '#6b7280',
  },
  
  surface: {
    background: '#ffffff',
    card: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.5)',
    elevated: '#ffffff',
  },
};

// Accessibility Constants
export const A11Y = {
  // Minimum touch target size (44px per WCAG)
  minTouchTarget: '2.75rem',
  
  // Focus ring configuration
  focusRing: {
    width: '2px',
    style: 'solid',
    color: '#0078b9',
    offset: '2px',
  },
  
  // Animation preferences
  reducedMotion: {
    duration: '0.01ms',
    easing: 'linear',
  },
};

// Project-specific Constants
export const PROJECT_CONSTANTS = {
  // Project card colors
  colors: [
    'bg-project-physics',    // Purple/magenta
    'bg-project-disaster',   // Green  
    'bg-project-biology',    // Orange/brown
    'bg-project-astronomy',  // Red/orange
    'bg-primary-blue',       // Additional blue
    'bg-primary-orange',     // Additional orange
  ],
  
  // File tree configuration
  fileTree: {
    indentSize: '1rem',     // 16px
    itemHeight: '2.5rem',   // 40px
    iconSize: '1rem',       // 16px
  },
  
  // Modal configurations
  modal: {
    maxWidth: '28rem',      // 448px
    padding: '2rem',        // 32px
    borderRadius: '1rem',   // 16px
  },
};
