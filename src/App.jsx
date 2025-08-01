import { useState } from 'react'
import './App.css'
import AncillaryDataParser from './components/AncillarDataParser'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <AncillaryDataParser />
    </>
  )
}

export default App
