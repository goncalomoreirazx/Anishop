import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

function UserList({ onEdit }) {
  const [users, setUsers] = useState([]);

  // Função para buscar utilizadores da API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users'); // Substitua com o endpoint correto
      setUsers(response.data); // Atualiza o estado com os dados da API
    } catch (error) {
      console.error('Erro ao buscar os utilizadores:', error);
      alert('Não foi possível carregar os utilizadores.');
    }
  };

  // useEffect para carregar os utilizadores ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para deletar um utilizador
  const handleDelete = async (userId) => {
    if (window.confirm('Tem certeza que deseja deletar este utilizador?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`); // Substitua com o endpoint correto
        setUsers(users.filter((user) => user.id !== userId)); // Remove o utilizador da lista local
      } catch (error) {
        console.error('Erro ao deletar o utilizador:', error);
        alert('Não foi possível deletar o utilizador.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.username}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(user)}
                  className="text-primary hover:text-opacity-70 mr-3"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
