import React, { useState, useCallback } from 'react';
import { Box, Typography, Paper, Button, LinearProgress, Stack } from '@mui/material';
import { FileCheck, Upload,FileX   } from 'lucide-react';
import { appConfig } from './appConfig';
import { toast } from 'react-toastify';

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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            const validFiles = files.filter(file => 
                file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
                file.name.endsWith('.xlsx')
            );
            
            if (validFiles.length > 0) {
                if(validFiles.length > 20) {
                     alert("Maximum 20 files allowed");
                     onFileUpload(validFiles.slice(0, 20));
                     setFileName(`${validFiles.length > 20 ? 20 : validFiles.length} files selected`);
                } else {
                    onFileUpload(validFiles);
                    setFileName(`${validFiles.length} files selected`);
                }
            } else {
                // error handling
            }
        }
    }, [onFileUpload]);

    const handleFileSelect = useCallback((e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
             const validFiles = files.filter(file => 
                file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
                file.name.endsWith('.xlsx')
            );

            if (validFiles.length > 0) {
                 if(validFiles.length > 20) {
                    toast.warn("Maximum 20 files allowed. Only the first 20 files will be processed.", {
                        position: "top-right",
                        autoClose: 5000,
                        theme:"dark",
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    }); 
                    // alert("Maximum 20 files allowed");
                     onFileUpload(validFiles.slice(0, 20));
                     setFileName(`${validFiles.length > 20 ? 20 : validFiles.length} files selected`);
                } else {
                    onFileUpload(validFiles);
                    setFileName(`${validFiles.length} files selected`);
                }
            }
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
                backgroundColor: dragActive ? 'rgba(10, 14, 18, 0.72)' : 'rgba(8, 10, 14, 0.66)',
                backdropFilter: 'blur(26px) saturate(175%)',
                transition: 'all 0.2s ease-in-out',
                maxWidth: '500px', // Ideal Enterprise Width
                mx: 'auto',
                '&:hover': {
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    backgroundColor: 'rgba(12, 16, 20, 0.78)',
                    backdropFilter: 'blur(28px) saturate(185%)',

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
            <input
                type="file"
                multiple
                accept=".xlsx"
                onChange={handleFileSelect}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 10
                }}
            />


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
                        backgroundColor:error ? 'rgba(239, 68, 68, 0.1)' : fileName ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.14)',
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
                        title={fileName ? fileName : "Upload Files Here"}
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
                        {fileName ? fileName : "Upload Files Here"}
                    </Typography>
                    <Typography sx={{ color: error ? '#ef4444' : '#6b7280', fontSize: '0.75rem', mt: 0.2 }}>
                        {error ? "File couldn't be processed" : fileName ? "File ready for parsing" : "Drag and drop or browse .xlsx (Multiple files support)"}
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