import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './Home';
import Login from './login';
import LessonPlanForm from './Details';
import LessonsHistory from './LessonsHistory';
import LessonDetail from './Details';
import TopNav from './components/TopNav';
import Homepage from './components/Homepage';


function App() {

    return (
      <>

         <BrowserRouter>
           <Routes>
             <Route path="/" element={<Homepage />} />
             <Route path="/login" element={<><TopNav /><Login /></>} />
             <Route path="/details" element={<><TopNav /><LessonPlanForm/></>} />
             <Route path="/lessons" element={<><TopNav /><LessonsHistory /></>} />
             <Route path="/lessons/:index" element={<><TopNav /><LessonDetail /></>} />
           </Routes>
         </BrowserRouter>
      </>
    )
  }
  
  export default App
  