import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Stack, useTheme } from '@mui/material';
import { Calendar, ChevronRight } from 'lucide-react';

const ReportPeriodCard = ({ dateRange, stateAbbr, reportList = [] }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';
  const showList = Array.isArray(reportList) && reportList.length > 0;
  const startDate = dateRange?.startDate || '-';
  const endDate = dateRange?.endDate || '-';

  return (
    <Card
      elevation={0}
      className="group transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 "
      sx={{
        background: isLightMode ? 'rgba(255, 255, 255, 0.84)' : 'rgba(28, 28, 30, 0.6)',
        backdropFilter: 'blur(30px) saturate(190%)',
        WebkitBackdropFilter: 'blur(30px) saturate(190%)',
        borderRadius: '24px', // More rounded for iOS feel
        border: isLightMode
          ? '1px solid rgba(15, 23, 42, 0.12)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          background: isLightMode ? 'rgba(248, 250, 252, 0.95)' : 'rgba(35, 35, 38, 0.8)',
          borderColor: isLightMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)',
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
        background: isLightMode
          ? 'linear-gradient(90deg, rgba(255,255,255,0), rgba(15,23,42,0.14), rgba(255,255,255,0))'
          : 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.15), rgba(255,255,255,0))',
      }} />

      <CardContent sx={{ p: '10px !important' }}>
        {/* Header Section */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              className="flex items-center justify-center w-8 h-8 rounded-full"
              sx={{
                background: isLightMode ? 'rgba(139, 92, 246, 0.14)' : 'rgba(168, 85, 247, 0.2)',
                color: isLightMode ? '#7c3aed' : '#c084fc',
              }}
            >
              <Calendar size={16} strokeWidth={2.5} />
            </Box>
            <Typography sx={{
              fontSize: '12px',
              fontWeight: 700,
              color: isLightMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.5)',
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
              background: isLightMode ? 'rgba(15,23,42,0.08)' : 'rgba(255, 255, 255, 0.05)',
              color: isLightMode ? '#0f172a' : '#fff',
              border: isLightMode
                ? '1px solid rgba(15,23,42,0.14)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}
          />
        </Stack>

        {showList ? (
          <Box
            className="flex flex-col gap-1.5 rounded-[18px] relative"
            sx={{
              p: 1.5,
              maxHeight: 200,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              background: isLightMode ? 'rgba(15,23,42,0.04)' : 'rgba(0,0,0,0.3)',
              border: isLightMode
                ? '1px solid rgba(15,23,42,0.1)'
                : '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {reportList.map((entry, index) => (
              <Box
                key={`${entry.state}-${index}`}
                className="flex items-center justify-between rounded-[10px] px-2.5 py-1.5"
                sx={{
                  background: isLightMode ? 'rgba(15,23,42,0.04)' : 'rgba(255,255,255,0.05)',
                }}
              >
                <Box className="flex flex-col">
                  <Typography sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: isLightMode ? '#0f172a' : '#ffffff',
                  }}>
                    {entry.state}
                  </Typography>
                  <Typography sx={{
                    fontSize: '10px',
                    color: isLightMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.6)',
                  }}>
                    {entry.startDate} - {entry.endDate}
                  </Typography>
                </Box>
                <Box
                  className="flex items-center justify-center w-6 h-6 rounded-full"
                  sx={{ background: isLightMode ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.05)' }}
                >
                  <ChevronRight
                    size={12}
                    color={isLightMode ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.3)'}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            className="flex items-center justify-between p-4 rounded-[18px] relative"
            sx={{
              background: isLightMode ? 'rgba(15,23,42,0.04)' : 'rgba(0,0,0,0.3)',
              border: isLightMode
                ? '1px solid rgba(15,23,42,0.1)'
                : '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Box className="flex flex-col">
              <Typography sx={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                mb: 0.5,
                color: 'rgba(16, 185, 129, 0.85)',
              }}>
                From
              </Typography>
              <Typography sx={{
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: isLightMode ? '#0f172a' : '#ffffff',
              }}>
                {startDate}
              </Typography>
            </Box>

            <Box
              className="flex items-center justify-center w-7 h-7 rounded-full"
              sx={{ background: isLightMode ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.05)' }}
            >
              <ChevronRight
                size={14}
                color={isLightMode ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.3)'}
              />
            </Box>

            <Box className="flex flex-col text-right">
              <Typography sx={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                mb: 0.5,
                color: 'rgba(16, 185, 129, 0.85)',
              }}>
                To
              </Typography>
              <Typography sx={{
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: isLightMode ? '#0f172a' : '#ffffff',
              }}>
                {endDate}
              </Typography>
            </Box>
          </Box>
        )}

        
      </CardContent>
    </Card>
  );
};

export default ReportPeriodCard;