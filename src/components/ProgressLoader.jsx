import React from 'react';
import { 
  Dialog, 
  CircularProgress, 
  Box, 
  Typography, 
  Zoom, 
  LinearProgress,
  Stack
} from '@mui/material';
import { CheckCircle2, FileText, HeartPulse, ShieldCheck } from 'lucide-react';

// Apple-style Transition
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} timeout={400} />;
});

const LoadingModal = ({ progress }) => {
  const steps = [
    { label: 'Initializing', threshold: 0 },
    { label: 'Loading Tests', threshold: 20 },
    { label: 'Processing', threshold: 40 },
    { label: 'Analyzing', threshold: 60 },
    { label: 'Finalizing', threshold: 80 },
  ];

  const numericPercentage = Number(progress?.percentage || 0);
  const safePercentage = Number.isFinite(numericPercentage) ? numericPercentage : 0;
  const displayPercentage = safePercentage.toFixed(2);

  const currentStepIndex = steps.reduce((acc, step, idx) => (
    safePercentage >= step.threshold ? idx : acc
  ), 0);

  const isOpen = safePercentage >= 0 && safePercentage < 100;

  return (
    <Dialog 
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="xs"
      PaperProps={{
        sx: {
          background: 'rgba(23, 23, 23, 0.24)', // Apple Glass Dark
          // backdropFilter: 'blur(4px) saturate(170%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          width: '380px' // Compact Apple size
        }
      }}
      sx={{
        // backdropFilter: 'blur(2px)',
        // backgroundColor: 'rgba(0, 0, 0, 0)'
      }}
    >
      <Box sx={{ p: 4,  background: 'rgba(28, 28, 30, 0.38)', // iPhone Dark Mode background
        backdropFilter: 'blur(30px) saturate(190%)',
        WebkitBackdropFilter: 'blur(30px) saturate(190%)', }}>
        {/* Top Section: Hero Progress */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative', display: 'flex', mb: 2.5 }}>
            {/* Background Track */}
            <CircularProgress
              variant="determinate"
              value={100}
              size={72}
              thickness={1.5}
              sx={{ color: 'rgba(255, 255, 255, 0.05)' }}
            />
            {/* Active Progress with Glow */}
            <CircularProgress
              variant="determinate"
              value={safePercentage}
              size={72}
              thickness={3}
              sx={{
                color: '#10b981',
                position: 'absolute',
                left: 0,
                filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
                strokeLinecap: 'round',
              }}
            />
            <Box sx={{
              position: 'absolute', top: 0, left: 0, bottom: 0, right: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                {`${displayPercentage}%`}
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#fff', mb: 0.5 }}>
            Processing Clinical Records
          </Typography>
          <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.02em' }}>
            {steps[currentStepIndex].label.toUpperCase()} IN PROGRESS
          </Typography>
        </Box>

        {/* Stats Row: Ultra Compact */}
        <Stack direction="row" spacing={1} sx={{ mb: 4 }} className='w-full'>
          {[
            { label: 'Ancillary', val: progress.processedGeneral, icon: <FileText size={11} />, color: '#10b981' },
            { label: 'Ultramist', val: progress.processedTherapies, icon: <HeartPulse size={11} />, color: '#f99142ff' },
            { label: 'Surgical', val: progress.processedSurgical, icon: <HeartPulse size={11} />, color: '#5c92f6ff' }
          ].map((stat, i) => (
            <Box key={i} sx={{ 
              flex: 1, p: 1.5, borderRadius: '14px', 
              bgcolor: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center'
            }}>
              <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" mb={0.5} sx={{ color: stat.color }}>
                {stat.icon}
                <Typography sx={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.8, width: 'max-content' }}>
                  {stat.label}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                {stat.val}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Step Indicator Bar */}
        <Box sx={{ px: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={safePercentage} 
            sx={{ 
              height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)',
              mb: 2,
              '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 2 }
            }}
          />
          <Stack direction="row" justifyContent="space-between">
            {steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isDone = idx < currentStepIndex;
              return (
                <Box key={idx} sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  {isDone ? (
                    <CheckCircle2 size={14} color="#10b981" />
                  ) : (
                    <Box sx={{ 
                      width: 12, height: 12, borderRadius: '50%', 
                      border: '2px solid',
                      borderColor: isActive ? '#10b981' : 'rgba(255,255,255,0.1)',
                      bgcolor: isActive ? '#10b981' : 'transparent',
                      boxShadow: isActive ? '0 0 10px rgba(16, 185, 129, 0.6)' : 'none',
                      transition: 'all 0.3s ease'
                    }} />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Footer Security Badge */}
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mt={4} sx={{ opacity: 0.4 }}>
          <ShieldCheck size={12} color="#fff" />
          <Typography sx={{ fontSize: '10px', color: '#fff', fontWeight: 500, letterSpacing: '0.03em' }}>
            Personal Health
          </Typography>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default LoadingModal;