import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
// import AncillaryDataParser from './components/AncillarDataParser'
import { motion, AnimatePresence } from 'framer-motion'

const AncillarDataParserLazy  = lazy(() => import('./components/AncillarDataParser'))
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
            <AncillarDataParserLazy />
            
          </motion.div>
       
      </AnimatePresence>
 </Suspense>
    </div>
  )
}

export default App;