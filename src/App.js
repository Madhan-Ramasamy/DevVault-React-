// App.jsx
import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Landing from "./components/Landing";
import NotesPreview from "./components/NotesPreview";

export class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          {/* LOGIN / SIGNUP */}
          <Route path="/" element={<Auth />} />

          {/* MAIN APP */}
          <Route
            path="/home"
            element={
              <>
                <Landing />
                <NotesPreview />
              </>
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
