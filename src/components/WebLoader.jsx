import React from 'react';
import { motion } from 'framer-motion';
import Logo from './logo.png';
import { appConfig } from './appConfig';
const PremiumPatientLoader = () => {
  const bars = Array.from({ length: 12 });
  
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

  // Pulse effect for the spinner
  const pulseVariants = {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(116, 184, 123, 0.7)',
        '0 0 0 20px rgba(116, 184, 123, 0)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut',
      },
    },
  };

  // Individual bar animation with enhanced timing
  const barVariants = (i) => ({
    animate: {
      opacity: [0.1, 1, 0.1],
      scale: [0.8, 1, 0.8],
    },
    transition: {
      repeat: Infinity,
      duration: 1.2,
      delay: i * 0.1,
      ease: 'easeInOut',
    },
  });

  // Logo SVG component
  const Logo = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" stroke="#74B87B" strokeWidth="2"/>
      <path d="M20 24L22.5 26.5L28 20.5" stroke="#74B87B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="24" cy="24" r="16" fill="none" stroke="#74B87B" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
  
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
          {/* <Logo /> */}
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
          <p style={styles.product} className='flex items-center justify-center gap-2 font-bold'>{appConfig.appName.first+appConfig.appName.second} <small className='bg-green-900/50 px-2 border border-green-700 rounded-full text-sm text-green-400 font-medium'>{appConfig.version}</small></p>
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

const styles = {
  container: {
    height: '100vh',
    background: 'linear-gradient(-45deg, #0a0a0a, #1a1a1a, #0d0d0d, #0a0a0a)',
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
    background: 'radial-gradient(circle, rgba(116, 184, 123, 0.08) 0%, transparent 70%)',
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
  },
  logoContainer: {
    marginBottom: '20px',
  },
  spinnerContainer: {
    display: 'inline-block',
    position: 'relative',
  },
  spinner: {
    position: 'relative',
    width: '50px',
    height: '50px',
    margin: '0 auto 30px auto',
    borderRadius: '50%',
  },
  bar: {
    position: 'absolute',
    width: '4px',
    height: '12px',
    backgroundColor: '#74B87B',
    borderRadius: '3px',
    left: '23px',
    top: '19px',
    transformOrigin: 'center 25px',
    boxShadow: '0 0 8px rgba(116, 184, 123, 0.6)',
  },
  percentageContainer: {
    marginBottom: '20px',
  },
  percentage: {
    color: '#74B87B',
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
    color: '#74B87B',
    fontSize: '14px',
    letterSpacing: '3px',
    fontWeight: '700',
    margin: 0,
    textShadow: '0 0 10px rgba(116, 184, 123, 0.3)',
  },
  underline: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #74B87B, transparent)',
    marginTop: '8px',
  },
  product: {
    color: '#ffffffe7',
    fontSize: '20px',
    fontWeight: '700',
    marginTop: '12px',
    letterSpacing: '0.5px',
  },
  subtitle: {
    color: '#888888',
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
    background: '#74B87B',
    boxShadow: '0 0 8px rgba(116, 184, 123, 0.8)',
  },
  statusText: {
    color: '#888888',
    fontSize: '11px',
    fontWeight: '500',
    letterSpacing: '1px',
  },
};

export default PremiumPatientLoader;