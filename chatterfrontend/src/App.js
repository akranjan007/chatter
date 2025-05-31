import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import OpenRoute from './Utils/OpenRoute';
import Login from './Pages/Login';
import Navbar from './Component/Common/Navbar';
import PrivateRoute from './Utils/PrivateRoute';
import Chats from './Pages/Chats';

function App() {
  return (
    <div className="App">
      {/*Navbar */}
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>

        <Route
          path='/signup'
          element={
            <OpenRoute><Signup/></OpenRoute>
          }
        />

        <Route 
          path='/login'
          element={<OpenRoute><Login/></OpenRoute>}
        />

        <Route
          path='/chats'
          element={<PrivateRoute><Chats/></PrivateRoute>}
        />
      </Routes>
    </div>
  );
}

export default App;
