import React from 'react';
import { Box, TextField, Button, InputAdornment, Stack, useTheme } from '@mui/material';
import { MapPin, Check } from 'lucide-react';

const AppleGlassInput = ({ 
  inputValue, 
  handleInputChange, 
  handleSubmitStateChange, 
  isButtonDisabled, 
  stateProgress 
}) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === 'light';
  const isDone = stateProgress >= 100;
  const isProcessing = stateProgress > 0 && stateProgress < 100;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter State Code"
          InputProps={{
            disableUnderline: true, // Remove the Material line
            startAdornment: (
              <InputAdornment position="start">
                <MapPin 
                  size={16} 
                  style={{ 
                    color: isDone
                      ? '#10b981'
                      : isLightMode
                        ? 'rgba(15, 23, 42, 0.45)'
                        : 'rgba(255, 255, 255, 0.4)',
                    marginLeft: '8px',
                    transition: 'all 0.3s ease'
                  }} 
                />
              </InputAdornment>
            ),
            sx: {
              height: '48px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 500,
              color: isLightMode ? '#0f172a' : '#fff',
              background: isLightMode
                ? 'rgba(255, 255, 255, 0.88)'
                : 'rgba(0, 0, 0, 0.2)', // Deep glass indent
              backdropFilter: 'blur(10px)',
              border: isLightMode
                ? '1px solid rgba(15, 23, 42, 0.14)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: isLightMode
                ? 'inset 0 2px 4px rgba(15,23,42,0.08)'
                : 'inset 0 2px 4px rgba(0,0,0,0.2)', // Subtle inner depth
              transition: 'all 0.2s ease-in-out',
              paddingRight: '110px', // Space for the floating button

              '&:hover': {
                background: isLightMode
                  ? 'rgba(255, 255, 255, 0.96)'
                  : 'rgba(0, 0, 0, 0.3)',
                borderColor: isLightMode
                  ? 'rgba(15, 23, 42, 0.24)'
                  : 'rgba(255, 255, 255, 0.15)',
              },
              '&.Mui-focused': {
                background: isLightMode
                  ? 'rgba(255, 255, 255, 1)'
                  : 'rgba(0, 0, 0, 0.4)',
                borderColor: 'rgba(59, 246, 118, 0.5)',
                boxShadow: isLightMode
                  ? '0 0 0 4px rgba(59, 130, 246, 0.18), inset 0 2px 4px rgba(15,23,42,0.06)'
                  : '0 0 0 4px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)',
              }
            }
          }}
          // Hide standard labels for the clean Apple look
          sx={{
            '& .MuiInputBase-input::placeholder': {
              color: isLightMode ? 'rgba(15, 23, 42, 0.42)' : 'rgba(255, 255, 255, 0.3)',
              opacity: 1,
            }
          }}
        />

        {/* Apple Capsule Button */}
        <Button
          onClick={handleSubmitStateChange}
          disabled={isButtonDisabled || isDone}
          variant="contained"
          disableElevation
          sx={{
            position: 'absolute',
            right: 6,
            top: '50%',
            transform: 'translateY(-50%)',
            height: '36px',
            minWidth: '90px',
            borderRadius: '10px',
            textTransform: 'none',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            
            // Dynamic Backgrounds
            background: isDone
              ? 'rgba(16, 185, 129, 0.2)'
              : isProcessing
                ? 'rgba(59, 246, 165, 0.2)'
                : isLightMode
                  ? '#0f172a'
                  : '#fff', // White button is very "Apple"
            
            color: isDone
              ? '#10b981'
              : isProcessing
                ? '#3bf67dff'
                : isLightMode
                  ? '#ffffff'
                  : '#000',
            border: isDone 
              ? '1px solid rgba(16, 185, 129, 0.5)' 
              : isProcessing 
                ? '1px solid rgba(59, 246, 168, 0.5)' 
                : isLightMode
                  ? '1px solid rgba(15, 23, 42, 0.2)'
                  : 'none',

            '&:hover': {
              background: isDone
                ? 'rgba(16, 185, 129, 0.3)'
                : isLightMode
                  ? '#1e293b'
                  : '#f4f4f5',
              transform: 'translateY(-50%) scale(1.02)',
            },
            '&:active': {
              transform: 'translateY(-50%) scale(0.96)',
            },
            '&:disabled': {
              background: isLightMode
                ? 'rgba(15, 23, 42, 0.08)'
                : 'rgba(255, 255, 255, 0.05)',
              color: isLightMode
                ? 'rgba(15, 23, 42, 0.35)'
                : 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          {isDone ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Check size={14} />
              <span>Done</span>
            </Stack>
          ) : isProcessing ? (
            `${stateProgress}%`
          ) : (
            'Update'
          )}
        </Button>
      </Box>
    
  );
};


export default AppleGlassInput;