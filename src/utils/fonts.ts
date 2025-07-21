// Font face declarations for Helvetica Now Display
export const loadFonts = () => {
  const fontFaces = [
    // Regular weights
    {
      family: 'Helvetica Now Display',
      weight: '100',
      style: 'normal',
      file: 'HelveticaNowDisplay-Hairline.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '100',
      style: 'italic',
      file: 'HelveticaNowDisplay-HairlineI.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '200',
      style: 'normal',
      file: 'HelveticaNowDisplay-Thin.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '200',
      style: 'italic',
      file: 'HelveticaNowDisplay-ThinIta.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '300',
      style: 'normal',
      file: 'HelveticaNowDisplay-Light.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '300',
      style: 'italic',
      file: 'HelveticaNowDisplay-LightIta.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '400',
      style: 'normal',
      file: 'HelveticaNowDisplay-Regular.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '400',
      style: 'italic',
      file: 'HelveticaNowDisplay-RegIta.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '500',
      style: 'normal',
      file: 'HelveticaNowDisplay-Medium.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '500',
      style: 'italic',
      file: 'HelveticaNowDisplay-MedIta.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '600',
      style: 'normal',
      file: 'HelveticaNowDisplay-Bold.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '600',
      style: 'italic',
      file: 'HelveticaNowDisplay-BoldIta.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '700',
      style: 'normal',
      file: 'HelveticaNowDisplay-ExtraBold.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '700',
      style: 'italic',
      file: 'HelveticaNowDisplay-ExtBdIta.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '800',
      style: 'normal',
      file: 'HelveticaNowDisplay-Black.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '800',
      style: 'italic',
      file: 'HelveticaNowDisplay-BlackIta.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '900',
      style: 'normal',
      file: 'HelveticaNowDisplay-ExtBlk.ttf'
    },
    {
      family: 'Helvetica Now Display',
      weight: '900',
      style: 'italic',
      file: 'HelveticaNowDisplay-ExtBlkIta.ttf'
    }
  ];

  // Create and inject font face CSS
  const styleElement = document.createElement('style');
  const fontFaceDeclarations = fontFaces.map(font => `
    @font-face {
      font-family: '${font.family}';
      font-weight: ${font.weight};
      font-style: ${font.style};
      src: url('/${font.file}') format('truetype');
      font-display: swap;
    }
  `).join('');

  styleElement.textContent = fontFaceDeclarations;
  document.head.appendChild(styleElement);
};

// CSS-in-JS approach for direct import
export const fontFaceCSS = `
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 100;
    font-style: normal;
    src: url('/HelveticaNowDisplay-Hairline.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 100;
    font-style: italic;
    src: url('/HelveticaNowDisplay-HairlineI.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 200;
    font-style: normal;
    src: url('/HelveticaNowDisplay-Thin.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 200;
    font-style: italic;
    src: url('/HelveticaNowDisplay-ThinIta.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 300;
    font-style: normal;
    src: url('/HelveticaNowDisplay-Light.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 300;
    font-style: italic;
    src: url('/HelveticaNowDisplay-LightIta.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 400;
    font-style: normal;
    src: url('/HelveticaNowDisplay-Regular.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 400;
    font-style: italic;
    src: url('/HelveticaNowDisplay-RegIta.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 500;
    font-style: normal;
    src: url('/HelveticaNowDisplay-Medium.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 500;
    font-style: italic;
    src: url('/HelveticaNowDisplay-MedIta.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 600;
    font-style: normal;
    src: url('/HelveticaNowDisplay-Bold.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 600;
    font-style: italic;
    src: url('/HelveticaNowDisplay-BoldIta.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 700;
    font-style: normal;
    src: url('/HelveticaNowDisplay-ExtraBold.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 700;
    font-style: italic;
    src: url('/HelveticaNowDisplay-ExtBdIta.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 800;
    font-style: normal;
    src: url('/HelveticaNowDisplay-Black.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 800;
    font-style: italic;
    src: url('/HelveticaNowDisplay-BlackIta.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 900;
    font-style: normal;
    src: url('/HelveticaNowDisplay-ExtBlk.ttf') format('truetype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Helvetica Now Display';
    font-weight: 900;
    font-style: italic;
    src: url('/HelveticaNowDisplay-ExtBlkIta.ttf') format('truetype');
    font-display: swap;
  }
`;
