import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MuiLink from '@mui/material/Link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getQuizSection } from '../data/quizData';
import { useProgress } from '../hooks/useProgress';

export default function QuizQuestion() {
  const { sectionId } = useParams();
  const section = getQuizSection(sectionId);

  const { getStatus, setStatus } = useProgress();

  const [phase, setPhase] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (phase !== 'question') return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);


  if (!section) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2">Section not found</Typography>
        <MuiLink component={Link} to="/practice-quiz">
          Back to Practice Quiz
        </MuiLink>
      </Box>
    );
  }

  const questions = section.questions;
  const question = questions[currentIndex];
  const score = answers.filter((a) => a.isCorrect).length;
  const timerDisplay = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  const handleSubmit = () => {
    setSubmitted(true);
    setAnswers((prev) => [
      ...prev,
      {
        selected,
        correct: question.correct,
        isCorrect: selected === question.correct,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      // Save best score before transitioning to results
      const correctCount = answers.filter((a) => a.isCorrect).length;
      const totalCount = questions.length;
      const timeStr = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
      const existing = getStatus(`quiz:${sectionId}:best`, null);
      if (!existing || correctCount > existing.score) {
        setStatus(`quiz:${sectionId}:best`, { score: correctCount, total: totalCount, time: timeStr });
      }
      setPhase('results');
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const getOptionBorder = (letter) => {
    if (!submitted) {
      if (selected === letter) {
        return { border: '2px solid', borderColor: 'primary.main', bgcolor: 'rgba(45,48,141,0.04)' };
      }
      return { border: '1px solid #e0e0e0' };
    }
    // Post-submit
    if (letter === question.correct) {
      return { border: '2px solid #4caf50', bgcolor: '#f1f8e9' };
    }
    if (letter === selected && selected !== question.correct) {
      return { border: '2px solid #f44336', bgcolor: '#fff5f5' };
    }
    return { border: '1px solid #e0e0e0' };
  };

  // Phase: intro
  if (phase === 'intro') {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          {section.title}
        </Typography>
        <Typography sx={{ mb: 4, lineHeight: 1.7, color: 'text.secondary' }}>
          {section.context}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => setPhase('question')}
        >
          Begin Section ({questions.length} questions)
        </Button>
      </Box>
    );
  }

  // Phase: results
  if (phase === 'results') {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const totalCount = section.questions.length;
    const scaledScore = Math.round(100 + (correctCount / totalCount) * 900);
    const passed = scaledScore >= 720;
    const accuracy = Math.round((correctCount / totalCount) * 100);
    const timeStr = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        {/* Assessment Summary */}
        <Box sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto', mb: 6 }}>
          <Typography
            sx={{
              fontSize: '3.5rem',
              fontWeight: 800,
              color: passed ? '#4caf50' : '#f44336',
            }}
          >
            {scaledScore}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Score (100-1000 scale)
          </Typography>
          <Typography
            sx={{
              fontWeight: 600,
              color: passed ? '#4caf50' : '#f44336',
              mb: 3,
            }}
          >
            {passed
              ? 'Congratulations! You passed.'
              : 'You did not meet the passing score. Please review the material and try again.'}
          </Typography>
          <Typography sx={{ mb: 0.5 }}>
            Correct answers: {correctCount} / {totalCount}
          </Typography>
          <Typography sx={{ mb: 0.5 }}>Passing score: 720</Typography>
          <Typography sx={{ mb: 3 }}>Time: {timeStr}</Typography>

          {/* Strength / Improvement box */}
          <Box
            sx={{
              bgcolor: '#f5f5fa',
              borderRadius: 2,
              p: 3,
              textAlign: 'left',
            }}
          >
            {accuracy >= 80 ? (
              <>
                <Typography
                  sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}
                >
                  Strength Areas
                </Typography>
                <Typography>
                  {section.title} ({accuracy}%) — solid understanding
                  demonstrated.
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  sx={{ fontWeight: 700, color: '#e88c30', mb: 1 }}
                >
                  Areas for Improvement
                </Typography>
                <Typography>
                  {section.title} ({accuracy}%) — see the{' '}
                  <em>{section.title}</em> section of the exam study guide for
                  more information.
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Question Review */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Question Review
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mb: 3 }}
        >
          Click any question to see detailed explanations.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
          {section.questions.map((q, idx) => {
            const answer = answers[idx];
            const isCorrect = answer?.isCorrect;
            const selectedOption = q.options.find(
              (o) => o.letter === answer?.selected
            );
            const correctOption = q.options.find(
              (o) => o.letter === q.correct
            );
            const truncated =
              q.text.length > 80 ? q.text.slice(0, 80) + '...' : q.text;

            return (
              <Accordion
                key={q.id}
                disableGutters
                elevation={0}
                sx={{
                  borderLeft: `3px solid ${isCorrect ? '#4caf50' : '#f44336'}`,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      gap: 1,
                      mr: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: isCorrect ? '#4caf50' : '#f44336',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {isCorrect ? '✓' : '✗'}
                    </Typography>
                    <Typography
                      sx={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.875rem',
                      }}
                    >
                      {truncated}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        flexShrink: 0,
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                      }}
                    >
                      {isCorrect
                        ? `Correct: ${q.correct}`
                        : `Your: ${answer?.selected} | Correct: ${q.correct}`}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pb: 2 }}>
                  {!isCorrect && selectedOption && (
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                        Your answer ({answer.selected}): {selectedOption.text}
                      </Typography>
                      {q.wrongExplanations &&
                        q.wrongExplanations[answer.selected] && (
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            {q.wrongExplanations[answer.selected]}
                          </Typography>
                        )}
                    </Box>
                  )}
                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                      Correct answer ({q.correct}): {correctOption?.text}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary' }}
                    >
                      {q.explanation}
                    </Typography>
                  </Box>
                  {q.studyArea && (
                    <Typography
                      {...(q.studyAreaLink
                        ? { component: Link, to: q.studyAreaLink }
                        : {})}
                      sx={{
                        mt: 1,
                        fontStyle: 'italic',
                        fontSize: '0.8rem',
                        color: q.studyAreaLink ? 'primary.main' : 'text.secondary',
                        textDecoration: q.studyAreaLink ? 'underline' : 'none',
                      }}
                    >
                      Study Area: {q.studyArea}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" component={Link} to="/practice-quiz">
            Back to Sections
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setPhase('intro');
              setCurrentIndex(0);
              setAnswers([]);
              setSelected(null);
              setSubmitted(false);
              setElapsed(0);
            }}
          >
            Retry Section
          </Button>
        </Box>
      </Box>
    );
  }

  // Phase: question
  return (
    <Box>
      {/* Header bar */}
      <Box
        sx={{
          bgcolor: '#1a1a2e',
          color: 'white',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Practice Quiz
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {score} / {questions.length}
          </Typography>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {timerDisplay}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Question area */}
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        {/* Question number + scenario tag */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Question {currentIndex + 1} of {questions.length}
          </Typography>
          <Chip
            label={section.shortTitle}
            size="small"
            sx={{
              bgcolor: section.color,
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Question text */}
        <Typography sx={{ mb: 4, lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {question.text}
        </Typography>

        {/* Option cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          {question.options.map((option) => (
            <Box
              key={option.letter}
              onClick={() => !submitted && setSelected(option.letter)}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                borderRadius: 2,
                cursor: submitted ? 'default' : 'pointer',
                transition: 'border-color 0.15s, background-color 0.15s',
                ...getOptionBorder(option.letter),
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  mt: 0.25,
                }}
              >
                {option.letter}
              </Box>
              <Typography sx={{ lineHeight: 1.6 }}>{option.text}</Typography>
            </Box>
          ))}
        </Box>

        {/* Submit / Next button */}
        {!submitted ? (
          <Button
            variant="contained"
            size="large"
            disabled={!selected}
            onClick={handleSubmit}
          >
            Submit Answer
          </Button>
        ) : (
          <Button variant="contained" size="large" onClick={handleNext}>
            Next Question &rarr;
          </Button>
        )}

        {/* Feedback panel */}
        {submitted && (
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              borderLeft: `4px solid ${selected === question.correct ? '#4caf50' : '#f44336'}`,
              bgcolor: selected === question.correct ? '#f1f8e9' : '#fff5f5',
            }}
          >
            {selected === question.correct ? (
              <Typography sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                Correct!
              </Typography>
            ) : (
              <Typography sx={{ fontWeight: 700, color: '#f44336', mb: 1 }}>
                Incorrect
              </Typography>
            )}

            {selected !== question.correct && (
              <>
                <Typography sx={{ mb: 1 }}>
                  <strong>The correct answer is {question.correct}:</strong>{' '}
                  {question.explanation}
                </Typography>
                {question.wrongExplanations &&
                  question.wrongExplanations[selected] && (
                    <Typography sx={{ mt: 1 }}>
                      <strong>Your answer:</strong>{' '}
                      {question.wrongExplanations[selected]}
                    </Typography>
                  )}
              </>
            )}

            {selected === question.correct && (
              <Typography>{question.explanation}</Typography>
            )}

            {question.studyArea && (
              <Typography
                {...(question.studyAreaLink
                  ? { component: Link, to: question.studyAreaLink }
                  : {})}
                sx={{
                  mt: 2,
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                  color: question.studyAreaLink ? 'primary.main' : 'text.secondary',
                  textDecoration: question.studyAreaLink ? 'underline' : 'none',
                }}
              >
                Study Area: {question.studyArea}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
