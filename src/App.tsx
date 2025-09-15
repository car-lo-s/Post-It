import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Mesa } from "./rotas/mesa";
import { Login } from "./rotas/login";
import "./estilo.css";

function App() {
  return (
    <BrowserRouter>
      <section className="tela">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mesa" element={<Mesa />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;
