import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import { glossary } from '../data/examData';
import { PageHero, Section } from '../components';

const categories = [...new Set(glossary.map((g) => g.category))];

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filtered = glossary.filter((item) => {
    const matchesSearch =
      !search ||
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = categories.reduce((acc, cat) => {
    const items = filtered.filter((g) => g.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <>
      <PageHero
        title="Glossary"
        subtitle={`${glossary.length} terms across ${categories.length} categories`}
      />

      <Section sx={{ py: { xs: 3, md: 4 } }}>
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2, maxWidth: 400 }}
        />

        {/* Category filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip
            label="All"
            size="small"
            onClick={() => setActiveCategory(null)}
            sx={{
              fontWeight: 600,
              bgcolor: !activeCategory ? 'primary.main' : 'transparent',
              color: !activeCategory ? '#fff' : 'text.primary',
              border: '1px solid',
              borderColor: !activeCategory ? 'primary.main' : 'divider',
            }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              size="small"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              sx={{
                fontWeight: 600,
                bgcolor: activeCategory === cat ? 'primary.main' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'text.primary',
                border: '1px solid',
                borderColor: activeCategory === cat ? 'primary.main' : 'divider',
              }}
            />
          ))}
        </Box>

        {/* Terms by category */}
        {Object.entries(grouped).map(([category, items]) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: '1rem',
                mb: 1.5,
                pb: 0.5,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                display: 'inline-block',
              }}
            >
              {category}
            </Typography>
            {items.map((item) => (
              <Box
                key={item.term}
                sx={{
                  display: 'flex',
                  gap: 1,
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  alignItems: 'baseline',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    minWidth: { xs: 'auto', md: 260 },
                    flexShrink: 0,
                    color: 'primary.main',
                  }}
                >
                  {item.term}
                </Typography>
                <Typography sx={{ fontSize: '0.88rem', color: 'text.secondary', lineHeight: 1.5 }}>
                  {item.definition}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}

        {filtered.length === 0 && (
          <Typography sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            No terms match your search.
          </Typography>
        )}
      </Section>
    </>
  );
}
