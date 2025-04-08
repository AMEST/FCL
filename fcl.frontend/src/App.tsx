import { Suspense } from 'react';
import './i18n';
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home/Home";
import CheckList from "./routes/CheckList/CheckList";

function App() {
  return (
    <>
      <Suspense fallback="Loading...">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list/:id" element={<CheckList />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
