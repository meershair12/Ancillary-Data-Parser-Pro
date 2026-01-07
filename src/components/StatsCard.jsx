import React from 'react';
import { Box, Typography, Card, CardContent, Grid, LinearProgress, Stack } from '@mui/material';

import { Droplets, Scissors, Info } from 'lucide-react';
import { Assessment, LocalHospital } from '@mui/icons-material';

function StatsCards({ summary, setActiveTab }) {
    const stats = [
        {
            title: 'Total Records',
            value: summary?.totalCount || 0,
            parsedValue: summary?.totalParsedCount || 0,
            icon: <Assessment sx={{ fontSize: 18 }} />,
            tab: "ancillary",
            color: '#10b981', // Emerald
        },
        {
            title: 'Ancillary',
            value: summary?.generalCount || 0,
            parsedValue: summary?.generalParsedCount || 0,
            icon: <LocalHospital sx={{ fontSize: 18 }} />,
            tab: "ancillary",
            color: '#ef4444', // Rose
        },
        {
            title: 'Ultramist',
            value: summary?.therapiesCount || 0,
            parsedValue: summary?.therapiesParsedCount || 0,
            icon: <Droplets size={18} sx={{ fontSize: 18 }} />,
            tab: "ultramist",
            color: '#f97316', // Orange
        },
        {
            title: 'Surgical',
            value: summary?.surgicalCount || 0,
            parsedValue: summary?.surgicalParsedCount || 0,
            icon: <Scissors size={18} sx={{ fontSize: 18 }} />,
            tab: "surgical",
            color: '#3b82f6', // Blue
        }
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 1 }}>
            {stats.map((stat, index) => {
                const progress = stat.value > 0 ? (stat.parsedValue / stat.value) * 100 : 0;

                return (
                    <Grid item size={{ xs: 12, sm: 6, lg: 3 }} key={index} >
                        <Card
                            elevation={0}
                            onClick={() => stat.value > 0 && setActiveTab(stat.tab)}
                            sx={{
                                // background: 'rgba(61, 61, 61, 0.36)',
                                background: 'rgba(28, 28, 30, 0.6)', // iPhone Dark Mode background
                                backdropFilter: 'blur(30px) saturate(190%)',
                                WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '18px',
                                opacity: stat.value > 0 ? 1 : 0.5,
                                // filter: stat.value > 0 ? 'none' : 'grayscale(1)',

                                cursor: stat.value > 0 ? 'pointer' : 'not-allowed',
                                '&:hover': {
                                    borderColor: `rgba(255, 255, 255, 0.2)`,
                                },
                                position: 'relative',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    border: `1px solid ${stat.value > 0 ? stat.color : 'none'}50`,
                                    backgroundColor: stat.value > 0 ? 'rgba(37, 38, 39, 0.6)' : 'none',
                                }
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: '10%',
                                right: '10%',
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                            }} />

                            {/* Accent Glow Strip */}
                            <Box sx={{
                                position: 'absolute',
                                top: 0, left: 0, bottom: 0,
                                width: '3px',
                                bgcolor: stat.color,
                                borderTopLeftRadius: '12px',
                                borderBottomLeftRadius: '12px',
                                opacity: 0.8
                            }} />

                            <CardContent sx={{ p: '20px !important' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography
                                        sx={{
                                            color: '#9ca3af',
                                            fontWeight: 700,
                                            fontSize: '0.70rem',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>
                                    <Box sx={{ color: stat.color, opacity: 0.8 }}>
                                        {stat.icon}
                                    </Box>
                                </Stack>

                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: "1.5rem",

                                            // fontFamily: '"Roboto Mono", monospace', // Technical feel
                                            color: '#f3f4f6',
                                            // letterSpacing: '-1px'
                                        }}
                                    >
                                        {Number(stat.value).toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* Enterprise Progress Metrics */}
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <Typography sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                                            Efficiency: <span style={{ color: '#d1d5db' }}>{progress.toFixed(1)}%</span>
                                        </Typography>
                                        <Typography sx={{ color: '#9ca3af', fontSize: '0.7rem', fontWeight: 600 }}>
                                            {Number(stat.parsedValue).toLocaleString("en-US")} / {Number(stat.value).toLocaleString("en-US")}
                                        </Typography>
                                    </Box>

                                    <LinearProgress
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            height: 4,
                                            borderRadius: 2,
                                            bgcolor: 'rgba(255,255,255,0.05)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: stat.color,
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}

export default StatsCards;