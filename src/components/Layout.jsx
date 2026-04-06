import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';

const navItems = [
  { label: 'Dashboard', path: '/' },
  {
    label: 'Domains',
    children: [
      { label: 'D1: Agentic Architecture (27%)', path: '/domains/d1' },
      { label: 'D2: Tool Design & MCP (18%)', path: '/domains/d2' },
      { label: 'D3: Claude Code Config (20%)', path: '/domains/d3' },
      { label: 'D4: Prompt Engineering (20%)', path: '/domains/d4' },
      { label: 'D5: Context Management (15%)', path: '/domains/d5' },
    ],
  },
  {
    label: 'Scenarios',
    children: [
      { label: 'S1: Customer Support Agent', path: '/scenarios/s1' },
      { label: 'S2: Code Generation', path: '/scenarios/s2' },
      { label: 'S3: Multi-Agent Research', path: '/scenarios/s3' },
      { label: 'S4: Developer Productivity', path: '/scenarios/s4' },
      { label: 'S5: CI/CD Integration', path: '/scenarios/s5' },
      { label: 'S6: Data Extraction', path: '/scenarios/s6' },
    ],
  },
  { label: 'Practice', path: '/practice' },
  { label: 'Practice Quiz', path: '/practice-quiz' },
  {
    label: 'My Projects',
    children: [
      { label: 'Overview', path: '/my-projects' },
      { label: 'DX Plugins', path: '/my-projects/dx-plugins' },
      { label: 'AEM MCP Server', path: '/my-projects/aem-mcp' },
      { label: 'KI Project', path: '/my-projects/ki-bundestag' },
    ],
  },
  {
    label: 'Cheatsheets',
    children: [
      { label: 'Patterns vs Anti-Patterns', path: '/cheatsheets/patterns' },
      { label: 'Key Configs & Flags', path: '/cheatsheets/configs' },
      { label: 'Reference Matrix', path: '/cheatsheets/matrix' },
      { label: 'Community Tips', path: '/cheatsheets/tips' },
    ],
  },
  { label: 'Glossary', path: '/glossary' },
];

function NavDropdown({ item, location }) {
  const [open, setOpen] = useState(false);
  const isActive = item.children?.some((c) => c.path === location.pathname);

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Button
        size="small"
        sx={{
          color: isActive ? 'secondary.main' : 'rgba(255,255,255,0.75)',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          '&:hover': { color: '#ffffff' },
        }}
        endIcon={<ExpandMore sx={{ fontSize: '1rem !important' }} />}
      >
        {item.label}
      </Button>
      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            bgcolor: 'primary.main',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 1001,
            py: 0.5,
          }}
        >
          {item.children.map((child, idx) =>
            child.label === 'divider' ? (
              <Box key={`div-${idx}`} sx={{ borderTop: '1px solid rgba(255,255,255,0.15)', my: 0.5 }} />
            ) : (
              <Button
                key={child.path}
                component={Link}
                to={child.path}
                size="small"
                sx={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  color: location.pathname === child.path ? 'secondary.main' : 'rgba(255,255,255,0.75)',
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  px: 2,
                  py: 0.75,
                  '&:hover': { color: '#ffffff', bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                {child.label}
              </Button>
            )
          )}
        </Box>
      )}
    </Box>
  );
}

export default function Layout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'primary.main', borderBottom: 'none' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              mr: 3,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'secondary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'primary.main',
              }}
            >
              A
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
              CCA-F
            </Typography>
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.25, flex: 1 }}>
            {navItems.map((item) =>
              item.children ? (
                <NavDropdown key={item.label} item={item} location={location} />
              ) : (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  size="small"
                  sx={{
                    color: location.pathname === item.path ? 'secondary.main' : 'rgba(255,255,255,0.75)',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&:hover': { color: '#ffffff' },
                  }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { md: 'none' }, ml: 'auto', color: '#ffffff' }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            {navItems.map((item) =>
              item.children ? (
                <Box key={item.label}>
                  <ListItemButton disabled>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
                  </ListItemButton>
                  {item.children.map((child, idx) =>
                    child.label === 'divider' ? (
                      <Box key={`div-${idx}`} component="li" sx={{ borderTop: '1px solid', borderColor: 'divider', my: 0.5 }} />
                    ) : (
                      <ListItemButton
                        key={child.path}
                        component={Link}
                        to={child.path}
                        selected={location.pathname === child.path}
                        onClick={() => setDrawerOpen(false)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemText primary={child.label} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                      </ListItemButton>
                    )
                  )}
                </Box>
              ) : (
                <ListItemButton
                  key={item.path}
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                </ListItemButton>
              )
            )}
          </List>
        </Box>
      </Drawer>

      {/* Page content */}
      <Box component="main" sx={{ mt: '64px', flex: 1 }}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        data-print="hide"
        sx={{
          bgcolor: 'primary.main',
          py: 2.5,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.875rem',
        }}
      >
        CCA-F Exam Prep — Claude Certified Architect
        <Box sx={{ mt: 0.5, fontSize: '0.7rem', opacity: 0.7 }}>
          Unofficial study aid. Not affiliated with or endorsed by Anthropic, PBC.
        </Box>
      </Box>

      {/* Fixed side badge */}
      <Box
        data-print="hide"
        sx={{
          position: 'fixed',
          right: '-83px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)',
          zIndex: 9999,
          bgcolor: 'primary.main',
          color: '#ffffff',
          py: 0.5,
          px: 1.5,
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          borderRadius: 1.5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          whiteSpace: 'nowrap',
        }}
      >
        CCA-F Prep
      </Box>
    </Box>
  );
}
