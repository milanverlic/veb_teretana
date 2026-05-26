import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Učitavamo Bootstrap stilove
import './index.css';
import App from './App';
import HomeScreen from './screens/HomeScreen';
import ExerciseListScreen from './screens/ExerciseListScreen';
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
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);