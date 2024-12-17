import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // Pega o token e decodifica para verificar se é admin
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('userName') === 'admin'; // Ou outra forma de verificar se é admin

  // Se não tiver token ou não for admin, redireciona para o login
  if (!token || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Se for admin, renderiza o conteúdo
  return children;
};

export default AdminRoute;