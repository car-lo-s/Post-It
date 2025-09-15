import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export const Login = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState<string>("");
  const navigate = useNavigate();

  // Busca os usuários da API
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

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value.toLowerCase());
  };

  const handleLogin = () => {
    const usuarioEncontrado = usuarios.find(
      (usuario) => usuario.nome.toLowerCase() === nome
    );

    if (usuarioEncontrado) {
      navigate("/mesa", { state: { usuario: usuarioEncontrado } });
    } else {
      alert("Usuário não encontrado!");
    }
  };

  return (
    <div className="telaEfeito">
      <section className="telaLogin">
      <h1>Post It</h1>
      <div>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          placeholder="Digite seu nome"
          value={nome}
          onChange={handleNomeChange}
        />
      </div>
      <div>
        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" placeholder="Digite sua senha" />
      </div>
      <div>
        <button onClick={handleLogin}>Entrar</button>
      </div>
    </section>
    </div>
  );
};
