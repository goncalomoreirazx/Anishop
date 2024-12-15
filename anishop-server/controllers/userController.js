const db = require('../db/connection'); // Certifique-se de que este é o caminho correto para a conexão ao banco de dados

// Buscar todos os usuários (exceto as senhas)
const getAllUsers = (req, res) => {
    const query = 'SELECT id, username, email FROM users';
  
    db.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao buscar usuários:', error.message);
        return res.status(500).json({ error: 'Erro ao buscar usuários.' });
      }
  
      // Verifica se `results` é um array válido
      if (Array.isArray(results)) {
        return res.status(200).json(results);
      } else {
        console.error('O resultado da query não é iterável:', results);
        return res.status(500).json({ error: 'Erro inesperado ao buscar usuários.' });
      }
    });
  };
  
  const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      const query = 'DELETE FROM users WHERE id = ?';
      const [result] = await db.query(query, [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error.message); // Log detalhado do erro
      res.status(500).json({ message: 'Erro ao deletar usuário.' });
    }
  };
  

module.exports = {
  getAllUsers,
  deleteUser,
};
