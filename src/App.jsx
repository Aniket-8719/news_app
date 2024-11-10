import React, { useState } from 'react'
import Navbar from './components/Navbar'
import News from './components/News'
import { Route, Routes } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar'

function App() {
  const pageAmount = 15;
  const [progress, setProgress] = useState(0);

  return (
    <>
    <LoadingBar
        height={3}
        color='#f11946'
        progress={progress}
        
      />
    
     <Navbar/>
     <Routes>
          <Route  exact  path='/' element={<News setProgress={setProgress}   key="general" pageSize={pageAmount} country={'in'} category={'general'} />} />
          <Route  exact  path='/business' element={<News setProgress={setProgress}    key="business" pageSize={pageAmount} country={'in'} category={'business'} />} />
          <Route  exact  path='/entertainment' element={<News setProgress={setProgress}    key="entertainment" pageSize={pageAmount} country={'in'} category={'entertainment'} />} />
          <Route  exact  path='/health' element={<News setProgress={setProgress}   key="health" pageSize={pageAmount} country={'in'} category={'health'} />} />
          <Route  exact path='/science' element={<News setProgress={setProgress}   key="science" pageSize={pageAmount} country={'in'} category={'science'} />} />
          <Route  exact path='/technology' element={<News setProgress={setProgress}   key="technology" pageSize={pageAmount} country={'in'} category={'technology'} />} />
      </Routes>
     
    </>
  )
}

export default App
