import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Stack } from '@mui/material';
import { FileCheck, Upload,FileX   } from 'lucide-react';
import { appConfig } from './appConfig';

function FileUpload({ onFileUpload, loading, fileName, setFileName, error }) {
    const [dragActive, setDragActive] = useState(false);
    // const [fileName, setFileName] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);
 
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);
            onFileUpload(file);
        }
    }, [onFileUpload]);

    const handleFileSelect = useCallback((e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            onFileUpload(file);
            e.target.value = "";
        }
    }, [onFileUpload]);

    return (
        <Paper
            elevation={0}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px dashed',
                borderColor: error ? 'rgba(239, 68, 68, 0.2)' : dragActive ? '#10b981' : 'rgba(255, 255, 255, 0.12)',
                backgroundColor: dragActive ? 'rgba(16, 185, 129, 0.04)' : 'rgba(63, 63, 63, 0.2)',
                transition: 'all 0.2s ease-in-out',
                maxWidth: '500px', // Ideal Enterprise Width
                mx: 'auto',
                '&:hover': {
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    backgroundColor: 'rgba(87, 87, 87, 0.25)',

                }
            }}
        >
            {loading && (
                <LinearProgress
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        bgcolor: 'transparent',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#10b981',
                        }
                    }}
                />
            )}

            <Stack direction="row" spacing={3} alignItems="center">
                {/* Icon Container - Scaled Down */}
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:error ? 'rgba(239, 68, 68, 0.1)' : fileName ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid',
                        borderColor: error ? 'rgba(239, 68, 68, 0.2)' : fileName ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.2s ease-in-out',

                    }}
                >
                    {fileName ? (
                        error?<FileX  size={24} color="#ef4444" />:<FileCheck size={24} color={appConfig.color.primary} />
                    ) : (
                        <Upload className='upload-icon' size={24} color={dragActive ? appConfig.color.primary : "#6b7280"} />
                    )}
                </Box>

                {/* Text Content - Aligned Left for scanability */}
                <Box sx={{ flexGrow: 1, textAlign: 'left', maxWidth: '60%' }}>
                    <Typography
                        title={fileName ? fileName : "Upload File Here"}
                        sx={{
                            color: '#f3f4f6',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            // width: '90%',
                            maxWidth: '100%' // or set a fixed width if needed
                        }}
                    >
                        {fileName ? fileName : "Upload File Here"}
                    </Typography>
                    <Typography sx={{ color: error ? '#ef4444' : '#6b7280', fontSize: '0.75rem', mt: 0.2 }}>
                        {error ? "File couldn't be processed" : fileName ? "File ready for parsing" : "Drag and drop or browse .xlsx"}
                    </Typography>
                </Box>

                {/* Action - Compact Button */}
                <Button
                    variant="outlined"
                    component="label"
                    disabled={loading}
                    size="small"
                    sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: '#9ca3af',
                        px: 2,
                        '&:hover': {
                            borderColor: appConfig.color.primary,
                            color: appConfig.color.primary,
                            backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        }
                    }}
                >
                    Browse
                    <input type="file" accept=".xlsx" hidden onChange={handleFileSelect} />
                </Button>
            </Stack>

            {/* Subtle Environment Indicator */}
            {/* <Box sx={{
                position: 'absolute',
                bottom: 0,
                right: 8,
                opacity: 0.5
            }}>
                <Typography sx={{ fontSize: '0.6rem', color: '#374151', letterSpacing: '0.05em' }}>
                    SECURE FHIR GATEWAY
                </Typography>
            </Box> */}
        </Paper>
    );
}

export default FileUpload;