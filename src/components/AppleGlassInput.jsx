import React from 'react';
import { Grid, Box, TextField, Button, InputAdornment, Stack } from '@mui/material';
import { MapPin, Check } from 'lucide-react';

const AppleGlassInput = ({ 
  inputValue, 
  handleInputChange, 
  handleSubmitStateChange, 
  isButtonDisabled, 
  stateProgress 
}) => {
  const isDone = stateProgress >= 100;
  const isProcessing = stateProgress > 0 && stateProgress < 100;

  return (
    <Grid item xs={12} md={4}>
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
                    color: isDone ? '#10b981' : 'rgba(255, 255, 255, 0.4)',
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
              color: '#fff',
              background: 'rgba(0, 0, 0, 0.2)', // Deep glass indent
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)', // Subtle inner depth
              transition: 'all 0.2s ease-in-out',
              paddingRight: '110px', // Space for the floating button

              '&:hover': {
                background: 'rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              },
              '&.Mui-focused': {
                background: 'rgba(0, 0, 0, 0.4)',
                borderColor: 'rgba(59, 246, 118, 0.5)',
                boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)',
              }
            }
          }}
          // Hide standard labels for the clean Apple look
          sx={{
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255, 255, 255, 0.3)',
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
                : '#fff', // White button is very "Apple"
            
            color: isDone ? '#10b981' : isProcessing ? '#3bf67dff' : '#000',
            border: isDone 
              ? '1px solid rgba(16, 185, 129, 0.5)' 
              : isProcessing 
                ? '1px solid rgba(59, 246, 168, 0.5)' 
                : 'none',

            '&:hover': {
              background: isDone ? 'rgba(16, 185, 129, 0.3)' : '#f4f4f5',
              transform: 'translateY(-50%) scale(1.02)',
            },
            '&:active': {
              transform: 'translateY(-50%) scale(0.96)',
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.2)',
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
    </Grid>
  );
};


export default AppleGlassInput;