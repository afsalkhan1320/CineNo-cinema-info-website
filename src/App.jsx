 import './App.css'
 import React from 'react';
 import{Header,Footer} from "./Components";
import { AllRoutes } from './Routes/AllRoutes';
function App() {
   
  return (
 <div className='app'>
   <Header/>
   <div className='page-content'>
  <AllRoutes/>
   </div>
  <Footer/>
 </div>
 
  )
}

export default App
