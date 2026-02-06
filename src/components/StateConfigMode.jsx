import React, { useMemo, useState } from 'react';
import {
  Modal, Box, Typography, IconButton, TextField,
  Button, CircularProgress, Stack
} from '@mui/material';
import { X, Globe, Cpu, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppleGlassModal = ({ open, handleCancel, handleConfirm, selectedFile }) => {
  const [stateAbbr, setStateAbbr] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);


  const isValid = stateAbbr.length === 2;



  const onConfirm = async () => {



    setIsProcessing(true);


    await handleConfirm(stateAbbr); // Assuming handleConfirm is passed as a prop
    setStateAbbr("")

    setIsProcessing(false);

  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || isProcessing) return;
    await onConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={isProcessing ? null : handleCancel}
      closeAfterTransition
      // Remove default backdrop transition to let Framer handle it
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        // backdropFilter: 'blur(2px)', // Optional: blur the background app
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            style={{
              background: 'rgba(28, 28, 30, 0.38)', // iPhone Dark Mode background
              backdropFilter: 'blur(30px) saturate(190%)',
              WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            }}
          >
            <Box

              component="form"
              onSubmit={onSubmit}

              sx={{
                width: 400, // Compact size
                background: 'rgba(32, 32, 32, 0.27)', // Apple dark glass base
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                overflow: 'hidden',
                position: 'relative',
                outline: 'none',
                p: 3
              }}>



              {/* Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '9px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                  }}>
                    <Cpu size={18} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                      State Configuration
                    </Typography>
                    <SystemId />
                  </Box>
                </Stack>
                <IconButton
                  onClick={handleCancel}
                  sx={{
                    color: 'rgba(255,255,255,0.4)',
                    '&:hover': { background: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Stack>

              {/* File Identity Chip */}
              <Box sx={{
                mb: 3, p: 1.5, borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'space-between'
              }}>
                <div className='flex items-center gap-2'>
                  <FileJson size={14} color="#10b981" />
                  <Typography
                    noWrap
                    title={selectedFile?.name}
                    sx={{
                      fontSize: '12px',
                      color: '#e2e8f0',
                      maxWidth: '200px', // adjust to your layout
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {selectedFile?.name || "No file selected"}
                  </Typography>
                </div>
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  Size: {selectedFile.size >= 1024 * 1024
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                    : `${(selectedFile.size / 1024).toFixed(1)} KB`}
                </Typography>

              </Box>

              {/* Input Section */}
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                State Region
              </Typography>

              <TextField
                fullWidth
                variant="standard"
                autoFocus
                disabled={isProcessing}
                value={stateAbbr}
                onChange={(e) => setStateAbbr(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="i.e FL"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: <Globe size={14} style={{ marginRight: 10, opacity: 0.4 }} />,
                  sx: {
                    height: 44, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '12px', px: 2,
                    fontSize: '13px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                    '&.Mui-focused': { border: '1px solid #10b981' }
                  }
                }}

                helperText="Enter the 2-letter state abbreviation (e.g., FL, MD, VA)"
                FormHelperTextProps={{
                  sx: { fontSize: '12px', color: 'rgba(255,255,255,0.35)', mt: 1, paddingLeft: '5px' }
                }}
              />

              {/* Actions */}
              <Stack direction="row" spacing={1.5} mt={4}>
                <Button
                  fullWidth
                  disabled={isProcessing}
                  onClick={handleCancel}
                  sx={{
                    height: 42, color: '#fff', fontSize: '13px', textTransform: 'none',
                    borderRadius: '12px', background: 'rgba(255,255,255,0.1)',
                    '&:hover': { background: 'rgba(255,255,255,0.15)' }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={onConfirm}
                  disabled={!isValid}
                  sx={{
                    height: 42, borderRadius: '12px', background: '#10b981',
                    fontSize: '13px', fontWeight: 600, textTransform: 'none', boxShadow: 'none',
                    '&:hover': { background: '#059669' },
                    '&.Mui-disabled': { background: 'rgba(7, 95, 66, 0.2)' }
                  }}
                >
                  {isProcessing ? <div className='flex item-center gap-2'> <CircularProgress size={16} color="inherit" /> Processing...</div> : 'Confirm'}
                </Button>
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};


function getRandomSystemId() {
  // Generate a random number between 0 and 999
  const randomNum = Math.floor(Math.random() * 1000);
  // Pad with zeros to make it 3 digits
  const paddedNum = String(randomNum).padStart(3, "0");
  return `SYSTEM_${paddedNum}`;
}

const SystemId = () => {
  const systemId = useMemo(() => getRandomSystemId(), []);


  return (
    <Typography
      sx={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}
    >
      ID: {systemId}
    </Typography>
  );
};

export default AppleGlassModal;