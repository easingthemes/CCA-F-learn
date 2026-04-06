import { useState } from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';

import Button from '@mui/material/Button';

import { studyPlan, domains, scenarios, getDomain, getScenario, resources, keyDocsPerPhase } from '../data/examData';
import MuiLink from '@mui/material/Link';
import { PageHero, Section, SectionHeading, ProgressBar } from '../components';
import { useProgress } from '../hooks/useProgress';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Check if a study-plan item's linked page (scenario or domain) is fully completed */
function isLinkedContentDone(item, getStatus) {
  if (!item.link) return false;
  // Scenario link: /scenarios/s1
  const scenarioMatch = item.link.match(/^\/scenarios\/(s\d+)$/);
  if (scenarioMatch) {
    const scenario = getScenario(scenarioMatch[1]);
    if (scenario && scenario.checklist && scenario.checklist.length > 0) {
      return scenario.checklist.every((_, i) =>
        getStatus(`scenario:${scenario.id}:${i}`, false)
      );
    }
    return false;
  }
  // Domain link: /domains/d1
  const domainMatch = item.link.match(/^\/domains\/(d\d+)$/);
  if (domainMatch) {
    const domain = domains.find((d) => d.id === domainMatch[1]);
    if (domain && domain.taskStatements.length > 0) {
      return domain.taskStatements.every((ts) =>
        getStatus(`task:${domain.id}:${ts.id}`, false)
      );
    }
    return false;
  }
  return false;
}

function domainCompletion(domain, getStatus) {
  const total = domain.taskStatements.length;
  if (total === 0) return { pct: 0, total, reviewed: 0 };
  const reviewed = domain.taskStatements.filter((ts) =>
    getStatus(`task:${domain.id}:${ts.id}`, false)
  ).length;
  return { pct: Math.round((reviewed / total) * 100), total, reviewed };
}

function computePhaseStatus(phase, getStatus) {
  const allItemsDone = phase.steps.flatMap((step, si) =>
    step.items.map((item, i) => {
      const key = `plan:${phase.id}:${si}:${i}`;
      return getStatus(key, false) || isLinkedContentDone(item, getStatus);
    })
  );
  const doneCount = allItemsDone.filter(Boolean).length;
  if (doneCount === allItemsDone.length) return 'completed';
  if (doneCount > 0) return 'in_progress';
  return 'pending';
}

function phaseSegmentBg(phase) {
  if (phase.status === 'completed') return '#4caf50';
  if (phase.status === 'in_progress') return 'linear-gradient(90deg, #36C0CF 60%, rgba(255,255,255,0.15) 100%)';
  return 'rgba(255,255,255,0.15)';
}

// ─── sub-components ─────────────────────────────────────────────────────────

function PhaseProgressBar({ getStatus }) {
  const phases = studyPlan.phases;
  return (
    <Box sx={{ bgcolor: 'primary.dark', color: '#fff', py: { xs: 4, md: 5 }, px: { xs: 2, md: 3 } }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', mb: 2, display: 'block' }}>
          Study Plan Progress
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5 }}>
          {phases.map((phase) => {
            const status = computePhaseStatus(phase, getStatus);
            return (
              <Box
                key={phase.id}
                sx={{
                  flex: 1,
                  height: 12,
                  borderRadius: 1,
                  background: phaseSegmentBg({ status }),
                }}
              />
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {phases.map((phase) => {
            const status = computePhaseStatus(phase, getStatus);
            return (
              <Box key={phase.id} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: status === 'completed'
                      ? '#4caf50'
                      : status === 'in_progress'
                      ? '#36C0CF'
                      : 'rgba(255,255,255,0.45)',
                    fontWeight: status === 'in_progress' ? 700 : 400,
                    fontSize: '0.68rem',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Phase {phase.id}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '0.6rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {status.replace('_', ' ')}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

function PhasePanel({ phase, defaultOpen, getStatus, toggleChecked }) {
  const [open, setOpen] = useState(defaultOpen);
  const status = computePhaseStatus(phase, getStatus);
  const isCurrent = status === 'in_progress';
  const isDone = status === 'completed';

  const borderColor = isCurrent ? '#36C0CF' : isDone ? '#4caf50' : '#ddd';
  const bgColor = isCurrent ? '#e8f4f8' : isDone ? '#f1f8e9' : '#fafafa';
  const statusIcon = isDone ? '✅' : isCurrent ? '▶️' : '⬜';

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        borderLeft: '4px solid',
        borderColor,
        borderRadius: '0 8px 8px 0',
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: { xs: 1.5, md: 2 },
          cursor: 'pointer',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
        }}
      >
        <Typography component="span" sx={{ fontSize: '1rem', flexShrink: 0 }}>{statusIcon}</Typography>
        <Typography variant="h3" sx={{ flex: 1, fontWeight: isCurrent ? 700 : 500, m: 0, fontSize: '0.95rem', color: isCurrent ? 'secondary.dark' : 'text.primary' }}>
          {phase.name}
        </Typography>
        {isCurrent && <Chip label="CURRENT" size="small" color="secondary" sx={{ fontWeight: 700, fontSize: '0.6rem', height: 20 }} />}
        <IconButton size="small" sx={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: { xs: 2, md: 3 }, pb: 2 }}>
          {phase.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontStyle: 'italic' }}>
              {phase.description}
            </Typography>
          )}
          {phase.steps.map((step, si) => (
            <Box key={si} sx={{ mb: si < phase.steps.length - 1 ? 2 : 0 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 600, fontSize: '0.8rem' }}>
                {step.name}
              </Typography>
              {/* Key Docs per step (Phase 2) */}
              {(() => {
                const stepKey = step.name.match(/Step (\d+\.\d+)/)?.[1];
                const docs = stepKey && keyDocsPerPhase[stepKey];
                return docs ? (
                  <Box sx={{ mb: 0.5, pl: 0.5 }}>
                    {docs.map((doc) => (
                      <MuiLink key={doc.url} href={doc.url} target="_blank" rel="noopener noreferrer" sx={{ fontSize: '0.72rem', mr: 1.5, color: 'primary.main' }}>
                        {doc.title}
                      </MuiLink>
                    ))}
                  </Box>
                ) : null;
              })()}
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {step.items.map((item, i) => {
                  const key = `plan:${phase.id}:${si}:${i}`;
                  const done = getStatus(key, false) || isLinkedContentDone(item, getStatus);
                  return (
                  <Box
                    key={i}
                    component="li"
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      py: 0.4,
                      borderBottom: i < step.items.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box
                      component="span"
                      onClick={(e) => { e.stopPropagation(); toggleChecked(key); }}
                      sx={{ fontSize: '0.85rem', lineHeight: 1.7, flexShrink: 0, cursor: 'pointer', userSelect: 'none' }}
                    >
                      {done ? '✅' : '⬜'}
                    </Box>
                    {item.link ? (
                      <Typography
                        variant="body2"
                        component={item.link.startsWith('http') ? 'a' : Link}
                        {...(item.link.startsWith('http') ? { href: item.link, target: '_blank', rel: 'noopener' } : { to: item.link })}
                        sx={{
                          flex: 1,
                          color: done ? 'text.secondary' : 'secondary.dark',
                          fontSize: '0.82rem',
                          textDecoration: done ? 'line-through' : 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {item.name}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ flex: 1, color: done ? 'text.secondary' : 'text.primary', fontSize: '0.82rem', textDecoration: done ? 'line-through' : 'none' }}>
                        {item.name}
                      </Typography>
                    )}
                    {item.priority === 'review' && (
                      <Chip label="REVIEW" size="small" sx={{ bgcolor: '#fff3e0', color: '#e65100', border: '1px solid #ffb74d', fontWeight: 700, fontSize: '0.55rem', height: 16, flexShrink: 0 }} />
                    )}
                    {item.priority === 'priority' && (
                      <Chip label="PRIORITY" size="small" sx={{ bgcolor: '#ffebee', color: '#c62828', border: '1px solid #ef9a9a', fontWeight: 700, fontSize: '0.55rem', height: 16, flexShrink: 0 }} />
                    )}
                    {item.watchFor && (
                      <Typography variant="caption" sx={{ width: '100%', pl: 3.5, mt: -0.2, mb: 0.3, color: 'text.secondary', fontSize: '0.75rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                        {item.watchFor}
                      </Typography>
                    )}
                  </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}

function StudyPlanSection({ getStatus, toggleChecked }) {
  return (
    <>
      <Typography variant="h2" sx={{ mb: 2, fontSize: '1.25rem', fontWeight: 700 }}>
        Study Plan
      </Typography>
      {studyPlan.phases.map((phase) => (
        <PhasePanel
          key={phase.id}
          phase={phase}
          defaultOpen={computePhaseStatus(phase, getStatus) === 'in_progress'}
          getStatus={getStatus}
          toggleChecked={toggleChecked}
        />
      ))}
    </>
  );
}

function DomainReadinessGrid({ getStatus }) {
  return (
    <Grid container spacing={2}>
      {domains.map((d) => {
        const { pct, total, reviewed } = domainCompletion(d, getStatus);
        return (
          <Grid key={d.id} size={{ xs: 6, sm: 4, md: 2.4 }}>
            <Card
              sx={{
                height: '100%',
                border: `2px solid ${d.color}22`,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: `0 4px 20px ${d.color}44` },
              }}
            >
              <CardActionArea component={Link} to={`/domains/${d.id}`} sx={{ height: '100%' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                  <Typography
                    variant="h2"
                    sx={{ fontSize: '2.2rem', fontWeight: 800, color: d.color, lineHeight: 1, mb: 0.5 }}
                  >
                    {d.weight}%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '0.7rem',
                      lineHeight: 1.3,
                      mb: 1.5,
                      minHeight: 28,
                    }}
                  >
                    {d.name.split(' ').slice(0, 3).join(' ')}
                  </Typography>
                  <ProgressBar value={pct} color={d.color} sx={{ mb: 0.75 }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                    {reviewed}/{total} tasks
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

function scenarioCompletion(scenario, getStatus) {
  const total = scenario.checklist ? scenario.checklist.length : 0;
  if (total === 0) return { pct: 0, total, checked: 0 };
  const checked = scenario.checklist.filter((_, i) =>
    getStatus(`scenario:${scenario.id}:${i}`, false)
  ).length;
  return { pct: Math.round((checked / total) * 100), total, checked };
}

function ScenarioGrid({ getStatus }) {
  return (
    <>
      <SectionHeading
        title="Scenarios"
        subtitle="4 of 6 randomly selected on the exam"
        badge="Exam Format"
        align="left"
        bg="alt"
      />
      <Section sx={{ pt: 4, pb: 6 }}>
        <Grid container spacing={2}>
          {scenarios.map((s) => {
            const { pct, total, checked } = scenarioCompletion(s, getStatus);
            return (
              <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%', '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.2s' }}>
                  <CardActionArea component={Link} to={`/scenarios/${s.id}`} sx={{ height: '100%', alignItems: 'flex-start' }}>
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, fontSize: '0.95rem' }}>
                        {s.name}
                      </Typography>
                      <ProgressBar value={pct} sx={{ mb: 0.75 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', display: 'block', mb: 1.5 }}>
                        {checked}/{total} checklist items
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {s.domains.map((dId) => {
                          const domain = getDomain(dId);
                          return domain ? (
                            <Chip
                              key={dId}
                              label={domain.name.split(' ')[0]}
                              size="small"
                              sx={{
                                bgcolor: `${domain.color}22`,
                                color: domain.color,
                                border: `1px solid ${domain.color}44`,
                                fontWeight: 600,
                                fontSize: '0.65rem',
                              }}
                            />
                          ) : null;
                        })}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Section>
    </>
  );
}

const quickLinks = [
  {
    to: '/practice',
    emoji: '📝',
    title: 'Practice Questions',
    desc: 'Scenario-based multiple choice drills',
  },
  {
    to: '/cheatsheets/patterns',
    emoji: '⚡',
    title: 'Cheatsheets',
    desc: 'Patterns, anti-patterns & key configs',
  },
  {
    to: '/my-projects',
    emoji: '🏗️',
    title: 'My Projects',
    desc: 'Your real-world work mapped to exam domains',
  },
];

function QuickLinks() {
  return (
    <Grid container spacing={2}>
      {quickLinks.map((link) => (
        <Grid key={link.to} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              height: '100%',
              '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
          >
            <CardActionArea component={Link} to={link.to} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>{link.emoji}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }}>
                  {link.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {link.desc}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { getStatus, toggleChecked, resetAll } = useProgress();

  const reviewedCount = domains.reduce((sum, d) =>
    sum + d.taskStatements.filter((ts) => getStatus(`task:${d.id}:${ts.id}`, false)).length, 0
  );
  const totalCount = domains.reduce((sum, d) => sum + d.taskStatements.length, 0);
  const stats = { reviewed: reviewedCount, total: totalCount };

  return (
    <>
      {/* 1. Hero */}
      <Box sx={{ position: 'relative' }}>
        <PageHero
          title="CCA-F Exam Prep"
          subtitle="Anthropic Certified Claude AI Associate-Foundation · 720/1000 to pass · Multiple choice · 4 of 6 scenarios on exam"
        />
        {/* Overall task counter */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 24 },
            right: { xs: 16, md: 32 },
            textAlign: 'right',
            color: '#fff',
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 800,
              lineHeight: 1,
              color: stats.reviewed === stats.total ? '#4caf50' : '#36C0CF',
            }}
          >
            {stats.reviewed}/{stats.total}
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.2 }}>
            tasks<br />reviewed
          </Typography>
        </Box>
      </Box>

      {/* 2. Phase progress bar */}
      <PhaseProgressBar getStatus={getStatus} />

      {/* 3. Study Plan + Domain Readiness */}
      <Section bg="default" sx={{ py: { xs: 4, md: 6 } }}>
        <StudyPlanSection getStatus={getStatus} toggleChecked={toggleChecked} />

        <Typography variant="h2" sx={{ mb: 2.5, fontSize: '1.25rem', fontWeight: 700, mt: 4 }}>
          Domain Readiness
        </Typography>
        <DomainReadinessGrid getStatus={getStatus} />
      </Section>

      {/* 4 + 5. Scenarios */}
      <ScenarioGrid getStatus={getStatus} />

      {/* 6. Quick links */}
      <SectionHeading title="Quick Links" align="left" bg="default" />
      <Section sx={{ pt: 0, pb: 2 }}>
        <QuickLinks />
      </Section>

      {/* 7. Resources */}
      <SectionHeading title="Resources & Documentation" align="left" bg="alt" />
      <Section sx={{ pt: 0, pb: 2 }}>
        <Grid container spacing={3}>
          {[
            { title: 'Official Materials', items: resources.official },
            { title: 'Anthropic Documentation', items: resources.documentation },
            { title: 'Hands-On Cookbooks', items: resources.cookbooks },
            { title: 'Community', items: resources.community },
          ].map((group) => (
            <Grid key={group.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 1 }}>
                {group.title}
              </Typography>
              {group.items.map((link) => (
                <Box key={link.url} sx={{ mb: 0.5 }}>
                  <MuiLink href={link.url} target="_blank" rel="noopener noreferrer" sx={{ fontSize: '0.85rem' }}>
                    {link.title}
                  </MuiLink>
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
        {resources.coursesToSkip && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>
              Courses to Skip (not exam-relevant)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {resources.coursesToSkip.join(' · ')}
            </Typography>
          </Box>
        )}
      </Section>

      {/* Reset */}
      <Section sx={{ py: 2, textAlign: 'center' }}>
        <Button
          size="small"
          color="error"
          variant="text"
          onClick={() => {
            if (window.confirm('Reset all progress? This cannot be undone.')) {
              resetAll();
            }
          }}
          sx={{ fontSize: '0.75rem', opacity: 0.4, '&:hover': { opacity: 1 } }}
        >
          Reset All Progress
        </Button>
      </Section>
    </>
  );
}
