import React from 'react';
import { Box, Button, Typography, Stack, Tooltip } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';
import { Droplets, Scissors } from 'lucide-react';

const AppleTabButton = ({ id, label, count, icon: Icon, activeTab, onClick, color }) => {
  const isActive = activeTab === id;
  
  return (
    <Tooltip 

    title={
  count > 0
    ? `${label} order${count > 1 ? 's' : ''} (${Number(count).toLocaleString("en-US")})`
    : `No ${label.toLowerCase()} orders found`
}

      arrow
      disableInteractive
    >
      {/* Wrap in span to enable tooltip on disabled button */}
      <span
        style={{ cursor: count === 0 ? 'not-allowed' : 'pointer',}}
      >
        <Button
          disabled={count === 0}
          disableRipple
          onClick={() => onClick(id)}
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: '12px',
            textTransform: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            minWidth: 'auto',
            background: isActive 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(255, 255, 255, 0.03)',
            backdropFilter: isActive ? 'blur(10px)' : 'none',
           
            border: '1px solid',
            borderColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.02)',
            },
            '&:active': {
              transform: 'scale(0.96)',
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Icon 
              size={16} 
              style={{ 
                color: color,
                filter: isActive ? `drop-shadow(0 0 5px ${color})` : 'none',
                opacity: isActive ? 1 : 0.6 
              }} 
            />
            
            <Typography sx={{ 
              fontSize: '12px', 
              fontWeight: isActive ? 700 : 500, 
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
            }}>
              {label}
            </Typography>

            <Box sx={{ 
              px: 0.8, 
              py: 0.2, 
              borderRadius: '6px', 
              bgcolor: isActive ? color : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease'
            }}>
              <Typography sx={{ 
                fontSize: '10px', 
                fontWeight: 800, 
                fontFamily: 'monospace',
                color: isActive ? '#000' : 'rgba(255,255,255,0.8)' 
              }}>
                {Number(count).toLocaleString("en-US")}
              </Typography>
            </Box>
          </Stack>

          {isActive && (
            <Box sx={{
              position: 'absolute',
              bottom: 4,
              left: '25%',
              right: '25%',
              height: '2px',
              bgcolor: color,
              borderRadius: '2px',
              boxShadow: `0 0 10px ${color}`
            }} />
          )}
        </Button>
      </span>
    </Tooltip>
  );
};

export const TestSwitcher = ({ data, activeTab, setActiveTab }) => {
  return (
    <Box sx={{ 
      display: 'inline-flex', 
      gap: 1, 
      p: 0.8, 
      borderRadius: '16px',
      // background: 'rgba(69, 68, 68, 0.45)',
      // backdropFilter: 'blur(20px)',
      // border: '1px solid rgba(255, 255, 255, 0.05)',
      mb: 0
    }}>
      <AppleTabButton
        id="ancillary"
        label="Ancillary"
        count={data.parsedGeneral.length}
        icon={LocalHospital}
        activeTab={activeTab}
        onClick={setActiveTab}
        color="#ef4444"
      />
      
      <AppleTabButton
        id="ultramist"
        label="Ultramist"
        count={data.parsedTherapies.length}
        icon={Droplets}
        activeTab={activeTab}
        onClick={setActiveTab}
        color="#f97316"
      />

      <AppleTabButton
        id="surgical"
        label="Surgical"
        count={data.parsedSurgical.length}
        icon={Scissors}
        activeTab={activeTab}
        onClick={setActiveTab}
        color="#3b82f6"
      />
    </Box>
  );
};