import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import TasksFormPage from './pages/TasksFormPage';
import Navigation from './components/Navigation';
import { Toaster } from 'react-hot-toast';

const App = () => {
    return (
        <BrowserRouter>
            <div className="container mx-auto">
                <Navigation />
                <Routes>
                    <Route path="/" element={<Navigate to="/tasks" />} />
                    <Route path="/tasks" element={<TasksPage />}></Route>
                    <Route
                        path="/tasks-create"
                        element={<TasksFormPage />}
                    ></Route>
                    <Route
                        path="/tasks/:id"
                        element={<TasksFormPage />}
                    ></Route>
                </Routes>
                <Toaster />
            </div>
        </BrowserRouter>
    );
};

export default App;
