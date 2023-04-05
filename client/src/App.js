import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Alert } from './components/alert/Alert';
import { ProtectedRoutes, RedirectFromLogin } from './util/ProtectedRoutes';
import Dashboard from './pages/Dashboard';
import { PageNotFound } from './pages/PageNotFound';
import { NavBar } from './components/navbar/NavBar';
import Activity from './pages/Activity';
import { ContextMenu } from './components/context-menu/ContextMenu';
import FolderPage from './pages/FolderPage';
import { RoomDetailContainer } from './components/container/RoomDetailContainer';
import RoomPage from './pages/RoomPage';
import { UploadBar } from './components/uploadbar/UploadBar';



function App() {

  function getWrappedNavBar(component) {
    return (
      <UploadBar>
        <ContextMenu>
          <NavBar>
            {component}
          </NavBar>
        </ContextMenu>
      </UploadBar>
    )
  }
  // function Logout() {
  //   return (<>
  //     {localStorage.clear()}
  //     <Navigate to="/" replace={true} />
  //   </>)
  // }
  return (

    <Alert>

      <BrowserRouter>

        <Routes>
          <Route element={<RedirectFromLogin />}>
            <Route path="/login" exact element={<Login />} />

          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path='*' element={<PageNotFound />} />
            <Route path="/" exact element={getWrappedNavBar(<Dashboard />)} />
            {/* <Route path="/activity" exact element={getWrappedNavBar(<Activity />)} /> */}
            <Route path="/folder/:id" exact element={getWrappedNavBar(<FolderPage />)} />
            <Route path="/room/:id" exact element={getWrappedNavBar(<RoomPage />)} />
            {/* <Route path="/logout" exact element={Logout()} /> */}
          </Route>
        </Routes>

      </BrowserRouter>
    </Alert>


  )
}

export default App;