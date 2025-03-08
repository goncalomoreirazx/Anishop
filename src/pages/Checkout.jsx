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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-10">
          {/* Checkout steps with visual indicators */}
          <div className="flex mb-8">
            <div className="flex-1 text-center">
              <div className="w-10 h-10 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-semibold">1</div>
              <div className="mt-2 text-sm font-medium">Shipping</div>
            </div>
            <div className="w-full flex items-center">
              <div className="h-1 w-full bg-primary"></div>
            </div>
            <div className="flex-1 text-center">
              <div className="w-10 h-10 mx-auto bg-primary text-white rounded-full flex items-center justify-center font-semibold">2</div>
              <div className="mt-2 text-sm font-medium">Payment</div>
            </div>
            <div className="w-full flex items-center">
              <div className="h-1 w-full bg-gray-300"></div>
            </div>
            <div className="flex-1 text-center">
              <div className="w-10 h-10 mx-auto bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-semibold">3</div>
              <div className="mt-2 text-sm font-medium text-gray-500">Confirmation</div>
            </div>
          </div>

          {/* Shipping address form */}
          <div className="bg-white p-8 rounded-xl shadow-card">
            <AddressForm register={register} errors={errors} />
          </div>

          {/* Payment form */}
          <div className="bg-white p-8 rounded-xl shadow-card">
            <PaymentForm register={register} errors={errors} />
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow-card sticky top-24">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">Order Summary</h3>

            {/* Cart items summary */}
            <div className="mb-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-100 pb-4 last:border-0">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={`http://localhost:5000/assets/images/${item.mainImage}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Price calculations */}
            <CartSummary items={cartItems} />

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className={`mt-6 w-full py-4 rounded-md font-medium ${
                loading || Object.keys(errors).length > 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-purple-800 text-white hover:opacity-90 transition-all shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm Purchase'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;

