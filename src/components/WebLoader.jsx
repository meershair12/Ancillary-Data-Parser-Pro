import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  appConfig,
  THEME_MODES,
  getResolvedThemeMode,
  subscribeToThemeChanges,
} from './appConfig';

const PremiumPatientLoader = () => {
  const [resolvedThemeMode, setResolvedThemeMode] = useState(getResolvedThemeMode());
  const isLightMode = resolvedThemeMode === THEME_MODES.LIGHT;
  const styles = useMemo(() => getStyles(isLightMode), [isLightMode]);

  useEffect(() => {
    const unsubscribeTheme = subscribeToThemeChanges((nextResolvedMode) => {
      setResolvedThemeMode(nextResolvedMode);
    });

    return () => {
      unsubscribeTheme();
    };
  }, []);
  
  // Gradient background animation
  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div 
      style={styles.container}
      variants={backgroundVariants}
      animate="animate"
      
    >
      {/* Ambient glow effect */}
      <div style={styles.glowEffect} />
      
      <div style={styles.loaderWrapper}>
        {/* Logo */}
        <motion.div
          style={styles.logoContainer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <img src="favicon.png" alt="Logo" style={styles.logoImage} />
        </motion.div>

        {/* Animated spinner container with pulse */}
     
          <motion.div 
            style={styles.spinner}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="20" stroke="#74B87B" strokeWidth="3" strokeDasharray="94" strokeDashoffset="0" opacity="0.3"/>
              <motion.circle 
                cx="25" 
                cy="25" 
                r="20" 
                stroke="#74B87B" 
                strokeWidth="3" 
                strokeDasharray="47" 
                strokeDashoffset="0"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
      

        {/* Loading percentage text */}
        <motion.div
          style={styles.percentageContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{  duration: 0.8 }}
        >
          <motion.span
            style={styles.percentage}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading...
          </motion.span>
        </motion.div>

        {/* Brand and product text */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{  duration: 0.8 }}
          style={styles.textContainer}
        >
          <div style={styles.brandWrapper} className='flex'>
      
            <h2 style={styles.brand} className='flex items-center gap-2'><img src="favicon.png" alt="Logo" style={{ width: '24px', height: '24px' }} /> PERSONIC HEALTH</h2>
            <motion.div 
              style={styles.underline}
              initial={{ width: 0 }}
              animate={{ width: '60px' }}
              transition={{  duration: 0.6 }}
            />
          </div>
          <p style={styles.product} className='flex items-center justify-center gap-2 font-bold'>
            {appConfig.appName.first + appConfig.appName.second}
            <small style={styles.versionBadge}>{appConfig.version}</small>
          </p>
          <p style={styles.subtitle}>Advanced Medical Data Processing</p>
        </motion.div>

        {/* Status indicator */}
        <motion.div
          style={styles.statusIndicator}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div style={styles.statusDot} />
          <span style={styles.statusText}>Initializing System...</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const getStyles = (isLightMode) => ({
  container: {
    height: '100vh',
    background: isLightMode
      ? 'linear-gradient(-45deg, #eef5ef, #e7f3e9, #f7fbf8, #edf6ee)'
      : 'linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0d0d0d, #0a0a0a)',
    backgroundSize: '400% 400%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    background: isLightMode
      ? 'radial-gradient(circle, rgba(229, 247, 230, 0.18) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(116, 184, 123, 0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  loaderWrapper: {
    textAlign: 'center',
    zIndex: 10,
    position: 'relative',
    width: 'min(90vw, 460px)',
  },
  logoContainer: {
    marginBottom: '20px',
  },
  logoImage: {
    width: '48px',
    height: '48px',
    margin: '0 auto',
  },
  spinner: {
    position: 'relative',
    width: '50px',
    height: '50px',
    margin: '0 auto 30px auto',
    borderRadius: '50%',
  },
  percentageContainer: {
    marginBottom: '20px',
  },
  percentage: {
    color: appConfig.color.primary,
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '1px',
  },
  textContainer: {
    marginTop: '30px',
  },
  brandWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  brand: {
    color: appConfig.color.primary,
    fontSize: '14px',
    letterSpacing: '3px',
    fontWeight: '700',
    margin: 0,
    textShadow: isLightMode
      ? '0 0 8px rgba(116, 184, 123, 0.18)'
      : '0 0 10px rgba(116, 184, 123, 0.3)',
  },
  underline: {
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${appConfig.color.primary}, transparent)`,
    marginTop: '8px',
  },
  product: {
    color: isLightMode ? '#1f2937' : '#ffffffe7',
    fontSize: '20px',
    fontWeight: '700',
    marginTop: '12px',
    letterSpacing: '0.5px',
  },
  versionBadge: {
    background: isLightMode ? 'rgba(116, 184, 123, 0.16)' : 'rgba(20, 83, 45, 0.5)',
    border: `1px solid ${isLightMode ? 'rgba(22, 101, 52, 0.35)' : 'rgba(21, 128, 61, 0.8)'}`,
    borderRadius: '999px',
    color: isLightMode ? '#166534' : '#4ade80',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1,
    padding: '4px 8px',
  },
  subtitle: {
    color: isLightMode ? '#4b5563' : '#888888',
    fontSize: '12px',
    fontWeight: '400',
    marginTop: '8px',
    letterSpacing: '1px',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '40px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: appConfig.color.primary,
    boxShadow: isLightMode
      ? '0 0 8px rgba(116, 184, 123, 0.5)'
      : '0 0 8px rgba(116, 184, 123, 0.8)',
  },
  statusText: {
    color: isLightMode ? '#4b5563' : '#888888',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '1px',
  },
});

export default PremiumPatientLoader;