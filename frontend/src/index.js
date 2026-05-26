import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Učitavamo Bootstrap stilove
import './index.css';
import App from './App';
import HomeScreen from './screens/HomeScreen';
import ExerciseListScreen from './screens/ExerciseListScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ActiveWorkoutScreen from './screens/ActiveWorkoutScreen';
import HistoryScreen from './screens/HistoryScreen';
import CommunityScreen from './screens/CommunityScreen';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

// Ovde ćemo definisati koje putanje vode do kojih stranica
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      {/* Dodajemo novu rutu ovde */}
      <Route path="/exercises" element={<ExerciseListScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/workout/active" element={<ActiveWorkoutScreen />} />
      <Route path="/history" element={<HistoryScreen />} />
      <Route path="/community" element={<CommunityScreen />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);