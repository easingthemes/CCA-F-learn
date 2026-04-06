import { createTheme } from '@mui/material/styles';

// Brand palette
// Primary: dark plum/indigo #2d308d — accent buttons, nav, headings
// Deep navy: #000048 — hero, footer, dark sections
// Soft purple: #9798c8 — secondary highlights, hover
// Teal: #1E728C — success/info accents
// Cyan: #36C0CF — links, interactive elements

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d308d',
      light: '#4a4db5',
      dark: '#000048',
    },
    secondary: {
      main: '#36C0CF',
      light: '#6dd8e3',
      dark: '#1E728C',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      alt: '#f5f5fa',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#4a4a5a',
      muted: '#7a7a8a',
    },
    warning: {
      main: '#e88c30',
    },
    info: {
      main: '#1E728C',
    },
  },
  typography: {
    fontFamily: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    h1: { fontWeight: 800, fontSize: '2.5rem', lineHeight: 1.15 },
    h2: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.2, marginBottom: '0.75rem' },
    h3: { fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' },
    body1: { fontSize: '0.95rem', lineHeight: 1.7 },
    body2: { fontSize: '0.9rem', lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: { minHeight: '100vh' },
        a: { color: '#2d308d', textDecoration: 'none' },
        'a:hover': { color: '#36C0CF' },
        code: {
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          background: 'rgba(45,48,141,0.06)',
          padding: '0.15rem 0.4rem',
          borderRadius: '2px',
          fontSize: '0.85em',
          color: '#2d308d',
        },
        '@media print': {
          // Hide nav, footer, side badge
          'header.MuiAppBar-root, [class*="MuiDrawer"], footer, [data-print="hide"]': {
            display: 'none !important',
          },
          // Remove top margin from main content (nav is hidden)
          'main': {
            marginTop: '0 !important',
          },
          // Force background colors and images to print
          '*': {
            printColorAdjust: 'exact',
            WebkitPrintColorAdjust: 'exact',
          },
          // Prevent cards, tables, flow diagrams from splitting across pages
          '.MuiCard-root, .MuiTableContainer-root, .MuiAlert-root': {
            breakInside: 'avoid',
          },
          // Images — full width, don't break
          img: {
            breakInside: 'avoid',
            maxWidth: '100% !important',
            height: 'auto !important',
          },
          // Tighten ALL spacing for print — sections, grids, margins
          body: {
            fontSize: '11px',
          },
          // Tighten section padding
          'section': {
            paddingTop: '24px !important',
            paddingBottom: '24px !important',
          },
          // Tighten grid gaps
          '.MuiGrid-container': {
            marginTop: '0 !important',
            gap: '8px !important',
            rowGap: '8px !important',
          },
          '.MuiGrid-container > .MuiGrid-root': {
            paddingTop: '4px !important',
            paddingLeft: '4px !important',
          },
          // Force MUI Grid to stay horizontal in print
          '.MuiGrid-root[class*="MuiGrid-size-md-4"]': {
            flexBasis: '31% !important',
            maxWidth: '31% !important',
          },
          '.MuiGrid-root[class*="MuiGrid-size-md-6"]': {
            flexBasis: '48% !important',
            maxWidth: '48% !important',
          },
          // Each major section starts on new page — SectionHeading + its Section stay together
          '[data-print="page-break"]': {
            breakBefore: 'page',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
});

export default theme;
