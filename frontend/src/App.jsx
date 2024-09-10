import React, { useState } from "react";
import axios from "axios";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { Navigate } from "react-router-dom";
import Login from "./components/Login";
import ToDo from "./components/ToDo";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/admin" element={<Dashboard />}></Route>
          <Route path="/todo" element={<ToDo />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
