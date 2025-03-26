
import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './Home';
import Login from './login';
import LessonPlanForm from './Details';


function App() {

    return (
      <>

         <BrowserRouter>

         <Routes>
             <Route path="/home" element={<Home />} />
             <Route path="/login" element={<Login />} />
             <Route path="/details" element={<LessonPlanForm/>} />

             
          </Routes>

          </BrowserRouter>
      </>
    )
  }
  
  export default App
  