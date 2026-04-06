import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import MuiLink from '@mui/material/Link';

import { myProjects, getDomain } from '../data/examData';
import { PageHero, Section, SectionHeading, ContentCard } from '../components';

export default function MyProjectsOverview() {
  return (
    <>
      {/* 1. PageHero */}
      <PageHero
        title="My Projects"
        subtitle="Real implementations mapped to exam domains"
      />

      {/* 2. Domain Mapping Table */}
      <SectionHeading title="Domain Mapping" />
      <Section>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Project</strong></TableCell>
                <TableCell><strong>Domains</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myProjects.map((project) => (
                <TableRow key={project.id} hover>
                  <TableCell>
                    <MuiLink
                      component={RouterLink}
                      to={`/my-projects/${project.id}`}
                      underline="hover"
                      sx={{ fontWeight: 600 }}
                    >
                      {project.name}
                    </MuiLink>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {project.domains.map((domainId) => {
                        const domain = getDomain(domainId);
                        if (!domain) return null;
                        return (
                          <Chip
                            key={domainId}
                            label={domain.name}
                            size="small"
                            sx={{ bgcolor: domain.color, color: '#fff' }}
                          />
                        );
                      })}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{project.description}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* 3. Projects Grid */}
      <SectionHeading title="Projects" />
      <Section>
        <Grid container spacing={3} columns={12}>
          {myProjects.map((project) => {
            const tags = project.domains.map((domainId) => {
              const domain = getDomain(domainId);
              return domain ? { label: domain.name } : null;
            }).filter(Boolean);

            return (
              <Grid key={project.id} size={{ xs: 12, md: 4 }}>
                <CardActionArea
                  component={RouterLink}
                  to={`/my-projects/${project.id}`}
                  sx={{ height: '100%', borderRadius: 2 }}
                >
                  <ContentCard
                    title={project.name}
                    tags={tags}
                    sx={{ height: '100%' }}
                  >
                    {project.description}
                  </ContentCard>
                </CardActionArea>
              </Grid>
            );
          })}
        </Grid>
      </Section>
    </>
  );
}
