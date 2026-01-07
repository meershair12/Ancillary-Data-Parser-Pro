import React from 'react';
import { Box, Typography, Chip, Divider, IconButton, Tooltip, FormControlLabel } from '@mui/material';
import {
    Terminal,
    ShieldCheck,
    Database,
    Settings,
    Activity,
    Cpu
} from 'lucide-react';
import Logo from './logo.png';
import { appConfig } from './appConfig';
import { IOSSwitch } from './ThemeToggleButton';
const EnterpriseHeader = () => {
    
    return (
        <Box sx={{ width: '100%', mb: 8 }}>
            {/* Top Utility Bar - Enterprise Standard */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 3,
                py: 1,
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                bgcolor: 'rgba(0, 0, 0, 1)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Cpu size={14} color="#6b7280" />
                        <Typography sx={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.1em' }}>
                            ENGINE:  {appConfig.version}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* <FormControlLabel
        control={<IOSSwitch sx={{ m: 1 }} defaultChecked  />}
        label="Dark Mode"
      /> */}
                   
                    <Chip
                        label="Latest Version"
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: '#74B87B',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            fontWeight: 700
                        }}
                    />
                </Box>
            </Box>

            {/* Main Header Body */}
            <Box sx={{ mt: 6, textAlign: 'center', position: 'relative' }}>
                {/* Decorative Background Element */}
                <Box sx={{
                    position: 'absolute',
                    top: '-50%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '400px',
                    height: '200px',
                    background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 1,
                    }}>
                        {/* Logo & Core Title Block */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            p: 3,
                            // borderRadius: '16px',
                            // bgcolor: 'rgba(17, 24, 39, 0.4)',
                            // border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}>
                            <Box sx={{
                                p: 1.5,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #1f8a6865 0%, #000000ff 100%)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0px 40px rgba(8, 97, 24, 0.7)'
                            }}>
                                <img src={Logo} className='w-7' />
                                {/* <ShieldCheck size={32} color="#10b981" /> */}
                            </Box>

                            <Box sx={{ textAlign: 'left' }}>
                                <Typography sx={{
                                    color: '#9ca3af',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.3em',
                                    textTransform: 'uppercase',
                                    mb: 0.5
                                }}>
                                    Personic Health Systems
                                </Typography>
                                <Typography variant="h4" sx={{
                                    color: '#f3f4f6',
                                    fontWeight: 800,
                                    fontSize: '1.75rem',
                                    letterSpacing: '-0.01em'
                                }}>
                                    {/* Personic OrderFlow <span style={{ color: appConfig.color.primary }}>Pro+</span> */}
                                    {appConfig.appName.first}<span style={{ color: appConfig.color.primary }}>{appConfig.appName.second}</span>
                                </Typography>
                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

                            <Box sx={{ textAlign: 'right', minWidth: '100px' }}>
                                <Typography sx={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 700, mb: 0.5 }}>
                                    STABLE RELEASE
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                    <Typography sx={{
                                        fontFamily: 'monospace',
                                        fontSize: '1rem',
                                        color: appConfig.color.primary,
                                        fontWeight: 700
                                    }}>
                                        {appConfig.version}
                                    </Typography>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: appConfig.color.primary, boxShadow: '0 0 10px ' + appConfig.color.primary }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Typography sx={{
                        color: '#9ca3af',
                        maxWidth: '600px',
                        mx: 'auto',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        fontWeight: 400
                    }}>
                        An advanced data processing platform that extracts and parses <span style={{ color: '#fff', fontWeight: 600 }}>Patient</span> order records with 99.9% accuracy, ensuring reliable and consistent data.
                    </Typography>

                    {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>99.9%</Typography>
                            <Typography sx={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Accuracy</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>90%</Typography>
                            <Typography sx={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Performance</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>100%</Typography>
                            <Typography sx={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>Available</Typography>
                        </Box>
                    </Box> */}
                </Box>
            </Box>
        </Box>
    );
};

export default EnterpriseHeader;