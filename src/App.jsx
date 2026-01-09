import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
// import AncillaryDataParser from './components/AncillarDataParser'
import { motion, AnimatePresence } from 'framer-motion'

const AncillarDataParserLazy  = lazy(() => import('./components/AncillarDataParser'))
const MedExtractDocumentationLazy  = lazy(() => import('./components/Documentation'))
// Variants for the Parent Container
const containerVariants = {
  // hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      // delayChildren: 0.3
    }
  }
};
import IOSLoader from './components/WebLoader'
import { appConfig } from './components/appConfig';
// import MedExtractDocumentation from './components/Documentation';
import { ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router'


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    document.title = `MediExtract ${appConfig.version} - Personic Health`;
  }, []);

  return (
    <div className="app-dark-theme">

 <Suspense fallback={<IOSLoader />}>
      <AnimatePresence mode="wait">
          <motion.div 
            key="content"
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            
          >
          <Routes>

          
           
            <Route path="/" element={<AncillarDataParserLazy />} />
            <Route path="/docs" element={<MedExtractDocumentationLazy />} />
            
            
          </Routes>
          </motion.div>
       
      </AnimatePresence>
 </Suspense>
    </div>
  )
}

export default App;