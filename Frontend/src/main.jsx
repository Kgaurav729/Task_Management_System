// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import Dashboard from './pages/DashBoard';
import { AuthProvider } from './context/AuthContext';
import ReactDOM from 'react-dom/client';
import PrivateRoute from './auth/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';
import ClientPage from './pages/ClientPage'; // we'll create this later
// import TaskPage from './pages/TaskPage';     // placeholder
// import InvoicePage from './pages/InvoicePage'; // placeholder
import ClientDetailPage from './pages/ClientDetailPage';
import InvoicePage from './pages/InvoicePage';
import './index.css';
import { ThemeProvider } from './components/ThemeProvider';
// import EditProfile from './pages/EditProfilePage';
import EditProfile from './pages/EditProfie';
ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <ThemeProvider>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/clients/:id/invoice" element={<InvoicePage />} />
            <Route path="/profile/edit" element={<EditProfile />} />

            {/* <Route path="/tasks" element={<TaskPage />} /> */}
            {/* <Route path="/invoices" element={<InvoicePage />} /> */}
          </Route>  
        {/* Add other protected routes here like /clients, /tasks etc */}
        </Route>
      </Routes>
    </AuthProvider>
    </ThemeProvider>
  </Router>
);
