import React from 'react';
import { Paper, Box, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import { Description, CheckCircle, Refresh, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { appConfig } from './appConfig';

// 1. Spring configuration for that "snappy" Apple feel
const springTransition = {
  type: "spring",
  stiffness: 260,
  damping: 25
};

// 2. Parent Container Variants (Orchestrator)
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.1, // This creates the sequential pop-in effect
    }
  }
};

// 3. Individual Element Variants
const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: springTransition 
  }
};

const GlassFileHeader = ({ fileName, handleReset }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper
        elevation={0}
        component={motion.div}
        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
        sx={{
          mb: 4,
          p: 2.5,
          background: 'rgba(28, 28, 30, 0.7)', // Darker iOS-style glass
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          
          {/* Left Side: Icon & Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            {/* Animated Icon Box */}
            <motion.div variants={itemVariants}>
              <motion.div 
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <Box 
                  sx={{
                    p: 1.5,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${appConfig.color.primary} 0%, #10b981 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <Description sx={{ color: 'white', fontSize: 28 }} />
                </Box>
              </motion.div>
            </motion.div>
            
            <Box>
              {/* Animated Filename */}
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 0.5, color: '#ffffff' }}
                >
                  {fileName || "document_name.pdf"}
                </Typography>
              </motion.div>

              {/* Animated Status Chip */}
              <motion.div variants={itemVariants}>
                <Chip
                  icon={<CheckCircle style={{ color: appConfig.color.primary, fontSize: '16px' }} />}
                  label="Parsed Successfully"
                  size="small"
                  sx={{
                    background: 'rgba(52, 211, 153, 0.12)',
                    color: appConfig.color.primary,
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                  }}
                />
              </motion.div>
            </Box>
          </Box>

          {/* Right Side: Actions (Each button staggers in) */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {[
              { icon: <Refresh fontSize="small" />, title: "Refresh", color: '#ffffff', bg: 'rgba(255,255,255,0.1)' },
              { icon: <Delete fontSize="small" />, title: "Delete", color: '#ff453a', bg: 'rgba(255, 69, 58, 0.15)' }
            ].map((action, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Tooltip title={action.title} arrow>
                  <IconButton
                    component={motion.button}
                    whileHover={{ scale: 1.15, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReset}
                    sx={{
                      background: action.bg,
                      color: action.color,
                      borderRadius: '14px',
                      p: 1.2,
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {action.icon}
                  </IconButton>
                </Tooltip>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default GlassFileHeader;