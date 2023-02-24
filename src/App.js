import Login from "./pages/login/Login";
import Rooms from "./pages/rooms/Rooms";
import Room from "./pages/room/Room";

import { StateProvider } from "./context/DataContext";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
    return (
        <StateProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<><Login /></>} />
                    <Route path="/rooms" element={<><Rooms /></>} />
                    <Route path="/room" element={<><Room /></>} />
                </Routes>
            </Router>
        </StateProvider>
    );
};

export default App;