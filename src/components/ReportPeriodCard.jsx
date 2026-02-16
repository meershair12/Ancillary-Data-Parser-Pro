import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { Calendar, ArrowRight, ChevronRight } from 'lucide-react';

const ReportPeriodCard = ({ dateRange, stateAbbr, reportList = [] }) => {
  const showList = Array.isArray(reportList) && reportList.length > 0;

  return (
    <Card
      elevation={0}
      className="group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
      sx={{
        background: 'rgba(28, 28, 30, 0.6)', // iPhone Dark Mode background
        backdropFilter: 'blur(30px) saturate(190%)',
        WebkitBackdropFilter: 'blur(30px) saturate(190%)',
        borderRadius: '24px', // More rounded for iOS feel
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          background: 'rgba(35, 35, 38, 0.8)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
        }
      }}
    >
      {/* Subtle Top Inner Glow - iPhone style */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
      }} />

      <CardContent sx={{ p: '20px !important' }}>
        {/* Header Section */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400">
              <Calendar size={16} strokeWidth={2.5} />
            </Box>
            <Typography sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
             Report Period
            </Typography>
          </Stack>
          
          <Chip
            label={stateAbbr}
            size="small"
            className="backdrop-blur-xl"
            sx={{
              height: '24px',
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
          />
        </Stack>

        {showList ? (
          <Box
            className="flex flex-col gap-1.5 rounded-[18px] bg-black/30 border border-white/5 relative"
            sx={{
              p: 1.5,
              maxHeight: 180,
              overflowY: 'auto'
            }}
          >
            {reportList.map((entry, index) => (
              <Box
                key={`${entry.state}-${index}`}
                className="flex items-center justify-between rounded-[10px] px-2.5 py-1.5 bg-white/5"
              >
                <Box className="flex flex-col">
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    {entry.state}
                  </span>
                  <span className="text-[10px] text-white/60">
                    {entry.startDate} - {entry.endDate}
                  </span>
                </Box>
                <Box className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5">
                  <ChevronRight size={12} className="text-white/20" />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box className="flex items-center justify-between p-4 rounded-[18px] bg-black/30 border border-white/5 relative">
            <Box className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">
                From
              </span>
              <span className="text-[15px] font-semibold text-white tracking-tight font-sans">
                {dateRange.startDate}
              </span>
            </Box>

            <Box className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5">
              <ChevronRight size={14} className="text-white/20" />
            </Box>

            <Box className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">
                To
              </span>
              <span className="text-[15px] font-semibold text-white tracking-tight font-sans">
                {dateRange.endDate}
              </span>
            </Box>
          </Box>
        )}

        
      </CardContent>
    </Card>
  );
};

export default ReportPeriodCard;