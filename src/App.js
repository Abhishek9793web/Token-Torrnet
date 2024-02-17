import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Torrnet from "./Torrnet";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<Torrnet />} />
        </Routes>
       
      </div>
    </Router>
  );
}

export default App;
