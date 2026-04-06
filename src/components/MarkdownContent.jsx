import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

const components = {
  h1: ({ children }) => (
    <Typography variant="h3" sx={{ mt: 4, mb: 2, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h4" sx={{ mt: 5, mb: 2, fontWeight: 700 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography
      variant="h6"
      sx={{ mt: 3, mb: 1, fontWeight: 600, color: 'primary.main' }}
    >
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.75 }}>
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ pl: 3, mb: 2, '& li': { mb: 0.5 } }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Typography component="li" variant="body1" sx={{ lineHeight: 1.75 }}>
      {children}
    </Typography>
  ),
  blockquote: ({ children }) => (
    <Box
      sx={{
        borderLeft: 4,
        borderColor: 'secondary.main',
        pl: 2,
        py: 1,
        my: 2,
        bgcolor: 'background.alt',
        borderRadius: 1,
      }}
    >
      {children}
    </Box>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.startsWith('language-');
    if (isBlock) {
      return (
        <Box
          component="pre"
          sx={{
            bgcolor: '#1e1e2e',
            color: '#cdd6f4',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            my: 2,
            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
          }}
        >
          <code>{children}</code>
        </Box>
      );
    }
    return (
      <Box
        component="code"
        sx={{
          bgcolor: 'action.hover',
          px: 0.75,
          py: 0.25,
          borderRadius: 0.5,
          fontSize: '0.85em',
          fontFamily: '"Fira Code", "JetBrains Mono", monospace',
        }}
        {...props}
      >
        {children}
      </Box>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <TableContainer component={Paper} variant="outlined" sx={{ my: 2 }}>
      <Table size="small">{children}</Table>
    </TableContainer>
  ),
  thead: ({ children }) => (
    <TableHead sx={{ bgcolor: 'background.alt' }}>{children}</TableHead>
  ),
  tbody: ({ children }) => <TableBody>{children}</TableBody>,
  tr: ({ children }) => <TableRow>{children}</TableRow>,
  th: ({ children }) => (
    <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
      {children}
    </TableCell>
  ),
  td: ({ children }) => (
    <TableCell sx={{ fontSize: '0.85rem' }}>{children}</TableCell>
  ),
  hr: () => <Divider sx={{ my: 4 }} />,
  strong: ({ children }) => (
    <Box component="strong" sx={{ fontWeight: 700 }}>
      {children}
    </Box>
  ),
};

export default function MarkdownContent({ content }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </Markdown>
  );
}
