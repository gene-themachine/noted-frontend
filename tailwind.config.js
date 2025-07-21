/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'helvetica': ['Helvetica Now Display', 'system-ui', 'sans-serif'],
        'sans': ['Helvetica Now Display', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Professional spacing scale
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
        '54': '13.5rem',  // 216px
        '58': '14.5rem',  // 232px
        '62': '15.5rem',  // 248px
        '66': '16.5rem',  // 264px
        '70': '17.5rem',  // 280px
        '74': '18.5rem',  // 296px
        '78': '19.5rem',  // 312px
        '82': '20.5rem',  // 328px
        '86': '21.5rem',  // 344px
        '90': '22.5rem',  // 360px
        '94': '23.5rem',  // 376px
        '98': '24.5rem',  // 392px
      },
      margin: {
        'sidebar': '22rem', // 352px (320px sidebar + 32px gap)
      },
      borderRadius: {
        'xs': '0.125rem',  // 2px
        '4xl': '2rem',     // 32px
        '5xl': '2.5rem',   // 40px
        '6xl': '3rem',     // 48px
      },
      maxWidth: {
        '8xl': '88rem',    // 1408px
        '9xl': '96rem',    // 1536px
        'sidebar': '20rem', // 320px
        'content': '64rem', // 1024px
      },
      minWidth: {
        'sidebar': '20rem', // 320px
        'content': '25rem', // 400px
      },
      height: {
        'header': '5rem',   // 80px
        'sidebar': '31.25rem', // 500px
        'card': '8rem',     // 128px
        'button': '3rem',   // 48px
        'button-lg': '4rem', // 64px
      },
      zIndex: {
        'dropdown': '40',
        'modal': '50',
        'tooltip': '60',
        'toast': '70',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'floating': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'floating-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      colors: {
        // Design system colors
        primary: {
          blue: '#0078b9',
          orange: '#ff7800',
          yellow: '#d0ad00',
          black: '#000000',
          white: '#ffffff',
          green: '#16a34a', // green-600
        },
        hover: {
          orange: '#d86600',
          blue: '#006ba3',
          gray: '#f3f4f6',
        },
        // Background system
        background: {
          DEFAULT: '#ffffff',
          secondary: '#fafafa',
          tertiary: '#f5f5f5',
          overlay: 'rgba(0, 0, 0, 0.5)',
        },
        // Surface colors
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#ffffff',
          hover: '#f9fafb',
          pressed: '#f3f4f6',
        },
        // Border system
        border: {
          DEFAULT: '#e5e7eb',
          light: 'rgba(229, 231, 235, 0.5)',
          strong: '#d1d5db',
        },
        // Text system
        foreground: {
          DEFAULT: '#000000',
          secondary: '#374151',
          tertiary: '#6b7280',
          muted: '#9ca3af',
          inverse: '#ffffff',
        },
        // Component specific colors
        card: {
          DEFAULT: '#ffffff',
          background: '#ffffff',
          border: '#e5e7eb',
          hover: '#f9fafb',
        },
        button: {
          primary: '#000000',
          'primary-hover': 'rgba(0, 0, 0, 0.9)',
          secondary: '#ff7800',
          'secondary-hover': '#d86600',
          ghost: 'transparent',
          'ghost-hover': '#f3f4f6',
        },
        // Project specific colors (kept from original)
        project: {
          physics: '#9d1767',    // Purple/magenta for Physics
          disaster: '#008017',   // Green for Natural Disaster
          biology: '#bc7400',    // Orange/brown for AP Biology
          astronomy: '#b94400',  // Red/orange for Astronomy
        },
        // Home page specific colors (enhanced)
        home: {
          background: '#faf9f5', // Cream background
          circle: '#0078b9',     // Blue circle
          avatar: '#666666',     // Gray avatar
          card: '#ffffff',       // Card background
        },
        // Status colors
        status: {
          success: '#16a34a',
          warning: '#d97706',
          error: '#dc2626',
          info: '#0078b9',
        },
        // Legacy support (maintaining backward compatibility)
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#000000',
        },
        primary_button: {
          DEFAULT: '#000000',
          foreground: '#ffffff',
          hover: '#000000/90',
        },
        secondary_button: {
          DEFAULT: '#ff7800',
          foreground: '#ffffff',
          hover: '#d86600',
        },
      },
      // Animation and transition system
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

