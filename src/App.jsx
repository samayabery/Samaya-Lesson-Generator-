import { BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './Home';
import Login from './login';
import LessonPlanForm from './Details';
import LessonsHistory from './LessonsHistory';
import LessonDetail from './Details';
import TopNav from './components/TopNav';


function App() {

    return (
      <>

         <BrowserRouter>
           <TopNav />
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/login" element={<Login />} />
             <Route path="/details" element={<LessonPlanForm/>} />
             <Route path="/lessons" element={<LessonsHistory />} />
             <Route path="/lessons/:index" element={<LessonDetail />} />
           </Routes>
         </BrowserRouter>
      </>
    )
  }
  
  export default App
  