const db = require('../db/connection');

const getAllUsers = (req, res) => {
  const query = 'SELECT id, username, email FROM users';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
    
    res.json(results);
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ message: 'Erro ao deletar usuário.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.json({ message: 'Usuário deletado com sucesso!' });
  });
};

module.exports = {
  getAllUsers,
  deleteUser
};