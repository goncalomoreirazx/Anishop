import { useLocation, useNavigate } from 'react-router-dom'; // Importando hooks do react-router-dom para navegação e obter dados da URL
import { useForm } from 'react-hook-form'; // Importando o hook 'useForm' para gerenciar o formulário
import { yupResolver } from '@hookform/resolvers/yup'; // Resolver para integrar react-hook-form com o Yup
import * as yup from 'yup'; // Importando o Yup para validação de esquema de dados
import { useState } from 'react'; // Importando useState para controlar o estado local (como o carregamento)
import AddressForm from '../components/checkout/AddressForm'; // Componente para o formulário de endereço
import PaymentForm from '../components/checkout/PaymentForm'; // Componente para o formulário de pagamento
import CartSummary from '../components/cart/CartSummary'; // Componente para mostrar o resumo do carrinho

// Definição do esquema de validação com Yup
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'), // Valida o nome
  lastName: yup.string().required('Last name is required'), // Valida o sobrenome
  address: yup.string().required('Address is required'), // Valida o endereço
  city: yup.string().required('City is required'), // Valida a cidade
  postalCode: yup.string().required('Postal code is required'), // Valida o código postal
  phone: yup.string().required('Phone number is required'), // Valida o telefone
  cardNumber: yup.string().matches(/^\d{16}$/, 'Card number must be 16 digits').required('Card number is required'), // Valida o número do cartão
  expiryDate: yup.string().required('Expiry date is required'), // Valida a data de validade do cartão
  cvv: yup.string().matches(/^\d{3}$/, 'CVV must be 3 digits').required('CVV is required'), // Valida o código de segurança (CVV)
});

function Checkout() {
  const location = useLocation(); // Obtém os dados de navegação, como os itens do carrinho, passados pela página anterior
  const navigate = useNavigate(); // Hook para navegação entre páginas
  const [loading, setLoading] = useState(false);  // Controle de estado para mostrar indicador de carregamento
  const cartItems = location.state?.items || []; // Recupera os itens do carrinho ou um array vazio se não houver itens

  // Calcula os valores para subtotal, envio e total
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0); // Calcula o total de itens no carrinho
  const shipping = 10; // Custo fixo de envio
  const total = subtotal + shipping; // Total final, incluindo o envio

  // Configuração do react-hook-form com validação usando Yup
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema), // Integração com o esquema de validação do Yup
  });

  // Função que é chamada quando o formulário é submetido
  const onSubmit = async (data) => {
    setLoading(true); // Marca como carregando enquanto processa

    const token = localStorage.getItem('token'); // Obtém o token de autenticação do localStorage
    if (!token) {
      alert('You must be logged in to complete the checkout.'); // Alerta se o usuário não estiver autenticado
      navigate('/login'); // Redireciona para a página de login
      return;
    }
  
    // Decodifica o token JWT para obter o ID do usuário
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id; // O ID do usuário está no token
  
    // Estrutura os dados do pedido a ser enviado para o servidor
    const orderData = {
      user_id: userId, // ID do usuário
      first_name: data.firstName,
      last_name: data.lastName,
      address: data.address,
      city: data.city,
      postal_code: data.postalCode,
      phone: data.phone,
      card_number: data.cardNumber,
      expiry_date: data.expiryDate,
      cvv: data.cvv,
      total_price: total, // Total da compra
      items: cartItems.map(item => ({ // Mapeia os itens do carrinho
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }))
    };
  
    // Exibe os dados do pedido no console para depuração
    console.log('Dados enviados para o checkout:', orderData);
  
    try {
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Envia dados no formato JSON
          'Authorization': `Bearer ${token}`, // Adiciona o token de autenticação no cabeçalho
        },
        body: JSON.stringify(orderData), // Corpo da requisição com os dados do pedido
      });
  
      const result = await response.json(); // Processa a resposta do servidor
      console.log('Resposta do servidor:', result);
  
      // Se a resposta for positiva, navega para a página de sucesso
      if (response.ok) {
        // Apaga os itens do carrinho do localStorage
        localStorage.removeItem('cartItems');
        navigate('/order-success', { state: { orderId: result.order_id, items: cartItems } });
      } else {
        console.error('Erro no checkout:', result);
        alert(result.message || 'Something went wrong. Please try again.'); // Exibe um erro se algo deu errado
      }
    } catch (error) {
      console.error('Erro ao realizar o checkout:', error);
      alert('An error occurred. Please try again later.'); // Exibe erro em caso de falha na requisição
    } finally {
      setLoading(false); // Remove o indicador de carregamento
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Formulário de Endereço */}
          <AddressForm register={register} errors={errors} />

          {/* Formulário de Pagamento */}
          <PaymentForm register={register} errors={errors} />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Order Summary</h3>

          {/* Resumo do Carrinho */}
          <CartSummary items={cartItems} />

          {/* Botão de Confirmação de Compra */}
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}  // Desativa o botão se houver erros no formulário ou se estiver carregando
            className="mt-4 w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
          >
            {loading ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;

