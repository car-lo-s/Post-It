import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import lupa from "../assets/search.svg";
import { useLocation, useNavigate } from "react-router-dom";

interface Nota {
  id: number;
  usuario_id: number;
  titulo: string;
  conteudo: string;
  cor: string;
  posicao_x: number;
  posicao_y: number;
  tags: string;
  criado_em: Date;
  atualizado_em: Date;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  nivel: string;
  criado_em: string;
  notas: Nota[];
}

export const Mesa = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const usuarioLogado: Usuario | null = location.state?.usuario || null;

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [tamanho, setTamanho] = useState(100);
  const [addCard, setAddCard] = useState(false);
  const [dadoCard, setDadoCard] = useState<Nota>({
    id: 0,
    usuario_id: usuarioLogado?.id || 0,
    titulo: "",
    conteudo: "",
    cor: "amarelo",
    posicao_x: 0,
    posicao_y: 0,
    tags: "",
    criado_em: new Date(),
    atualizado_em: new Date(),
  });
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  // Redireciona caso não haja usuário logado
  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/");
    }
  }, [usuarioLogado, navigate]);

  // Busca usuários
  const buscarUsuarios = async () => {
    try {
      const response = await axios.get<Usuario[]>("http://localhost:5036/api/Usuario");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const handlePesquisaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPesquisa(e.target.value);
  };

  const filtrarNotas = (notas: Nota[]) => {
    return notas.filter((nota) =>
      pesquisa ? nota.titulo.toLowerCase().includes(pesquisa.toLowerCase()) : true
    );
  };

  const ordenarNotasPorCor = (notas: Nota[]) => {
    const ordemCores = ["verde", "amarelo", "vermelho"];
    return [...notas].sort((a, b) => ordemCores.indexOf(a.cor) - ordemCores.indexOf(b.cor));
  };

  const gerarCards = (usuarioId: number) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario) return null;

    let notas = filtrarNotas(usuario.notas);
    if (filtroAtivo) notas = ordenarNotasPorCor(notas);

    return notas.map((nota) => (
      <div
        key={nota.id}
        className="card"
        style={!filtroAtivo ? { width: tamanho * 3, height: tamanho * 2, fontSize: tamanho / 100 + "em" } : undefined}
      >
        <p className="titulo">{nota.titulo}</p>
        <div className={`linha ${nota.cor}`}></div>
        <p className="texto">{nota.conteudo}</p>
        <p className="marcador"># {nota.tags}</p>
      </div>
    ));
  };

  const handlePreencherDado = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDadoCard((prev) => ({
      ...prev,
      [name]: value,
      atualizado_em: new Date(),
    }));
  };

  const enviarNota = async () => {
    try {
      await axios.post("http://localhost:5036/api/Notas", dadoCard);
      setAddCard(false);
      buscarUsuarios();
    } catch (error) {
      console.error("Erro ao enviar nota:", error);
    }
  };

  return (
    <section className="mesa">
      {/* Menu Lateral */}
      <section className="mesaMenu">
        <h1>Post-It</h1>

        <div className="prioridade">
          <h2>Prioridade</h2>
          <div>
            <p>Alta</p>
            <p>Média</p>
            <p>Baixa</p>
          </div>
        </div>

        <div className="filtros">
          <h2>Filtro</h2>
          <label className="switch">
            <input type="checkbox" checked={filtroAtivo} onChange={() => setFiltroAtivo(!filtroAtivo)} />
            <span className="slider"></span>
          </label>
          <p>Ajustar a grade</p>
        </div>

        <div className="usuarioCard">
          <div></div>
          <div>
            {usuarioLogado?.nome} <br /> {usuarioLogado?.nivel}
          </div>
          <div className="voltar" onClick={()=>navigate(-1)}></div>
        </div>
      </section>

      {/* Área de Cards */}
      <section className="mesaCards">
        <div className="mesaPesquisa">
          <div className="boxPesquisa">
            <div className="btnPesquisa" onClick={() => alert(pesquisa)}>
              <img src={lupa} alt="Buscar" />
            </div>
            <input type="text" placeholder="Busca..." value={pesquisa} onChange={handlePesquisaChange} />
          </div>

          <div className="novoCard" onClick={() => setAddCard(true)}></div>

          <div className="tamanhoTela">
            <div className="menos" onClick={() => setTamanho(Math.max(50, tamanho - 10))}>-</div>
            <div className="tamanho">{tamanho}%</div>
            <div className="mais" onClick={() => setTamanho(Math.min(100, tamanho + 10))}>+</div>
          </div>
        </div>

        <div className="quadroBranco">{usuarioLogado && gerarCards(usuarioLogado.id)}</div>
      </section>

      {/* Modal Novo Card */}
      {addCard && (
        <section className="novoCartao">
          <div>
            <label htmlFor="titulo">Titulo:</label>
            <input type="text" name="titulo" onChange={handlePreencherDado} />
          </div>
          <div>
            <label htmlFor="conteudo">Conteudo:</label>
            <input type="text" name="conteudo" onChange={handlePreencherDado} />
          </div>
          <div>
            <label htmlFor="tags">Tag:</label>
            <input type="text" name="tags" onChange={handlePreencherDado} />
          </div>
          <div>
            <label>
              <input type="radio" name="cor" value="verde" onChange={handlePreencherDado} /> Baixa
            </label>
            <label>
              <input type="radio" name="cor" value="amarelo" onChange={handlePreencherDado} /> Média
            </label>
            <label>
              <input type="radio" name="cor" value="vermelho" onChange={handlePreencherDado} /> Alta
            </label>
          </div>
          <button type="button" onClick={enviarNota}>Enviar</button>
          <div className="close" onClick={() => setAddCard(false)}></div>
        </section>
      )}
    </section>
  );
};
