import React from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Box 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SearchIcon from '@mui/icons-material/Search';

const HelpDesk = () => {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Typography variant="h3" className="font-bold mb-4 tracking-tight">
          How can we <span className="text-blue-500">help?</span>
        </Typography>
        <p className="text-gray-400 text-lg mb-8">
          Search our knowledge base or contact our 24/7 support team.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <TextField
            fullWidth
            placeholder="Search for articles, billing, or technical issues..."
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon className="text-gray-500 mr-2" />,
              className: "bg-zinc-900 text-white rounded-full border-zinc-700 focus-within:border-blue-500 transition-all"
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#333" },
                "&:hover fieldset": { borderColor: "#444" },
              },
              input: { color: 'white' }
            }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Typography variant="h5" className="font-semibold mb-4 border-l-4 border-blue-600 pl-4">
            Frequently Asked Questions
          </Typography>
          
          {[1, 2, 3, 4].map((item) => (
            <Accordion 
              key={item}
              className="bg-zinc-900 text-white border border-zinc-800 rounded-lg overflow-hidden"
              sx={{ backgroundColor: '#111', color: 'white' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon className="text-white" />}>
                <Typography className="font-medium">Question #{item}: How do I reset my API credentials?</Typography>
              </AccordionSummary>
              <AccordionDetails className="bg-black text-gray-400">
                <Typography>
                  To reset your credentials, navigate to Settings {'>'} Security {'>'} API Keys. 
                  Ensure you have administrative privileges before attempting this action.
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        {/* Right Column: Contact Support Card */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl">
            <Box className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-600/10 rounded-full mb-4">
                <SupportAgentIcon className="text-blue-500" fontSize="large" />
              </div>
              <Typography variant="h6" className="font-bold text-white mb-2">
                Talk to a Human
              </Typography>
              <p className="text-gray-400 text-sm mb-6">
                Our average response time is currently <strong>5 minutes</strong>.
              </p>
              <Button 
                fullWidth 
                variant="contained" 
                className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-all"
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Start Live Chat
              </Button>
            </Box>
          </Card>

          <Card className="bg-black border border-zinc-800 p-6 rounded-2xl">
            <Typography variant="subtitle1" className="font-bold text-white mb-2">
              System Status
            </Typography>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-500 text-sm font-medium">All systems operational</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpDesk;