const db = require('../db/connection'); // Importar a conexão com o banco de dados

// Controller para criar uma ordem
const createOrder = (req, res) => {
    const {
        user_id,           // ID do usuário que está fazendo o pedido
        first_name,        // Nome do cliente
        last_name,         // Sobrenome do cliente
        address,           // Endereço de entrega
        city,              // Cidade de entrega
        postal_code,       // Código postal
        phone,             // Número de telefone
        card_number,       // Número do cartão de pagamento
        expiry_date,       // Data de validade do cartão
        cvv,               // CVV do cartão
        total_price,       // Preço total do pedido
        items              // Itens no carrinho (array de objetos)
    } = req.body;

    // Validar os campos obrigatórios da tabela 'orders'
    if (
        !first_name || !last_name || !address || !city || !postal_code ||
        !phone || !card_number || !expiry_date || !cvv || !total_price
    ) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios para o pedido devem ser preenchidos' });
    }

    // Validar os itens do pedido (somente se eles existirem)
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Os itens do pedido são obrigatórios' });
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.id || !item.quantity || !item.price) {
            return res.status(400).json({
                message: `Item inválido na posição ${i + 1}: id, quantity e price são obrigatórios`
            });
        }
    }

    // Inserir os dados principais na tabela 'orders'
    const insertOrderQuery = `
        INSERT INTO orders (
            user_id, first_name, last_name, address, city, postal_code, 
            phone, card_number, expiry_date, cvv, total_price
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertOrderQuery, [
        user_id, first_name, last_name, address, city, postal_code,
        phone, card_number, expiry_date, cvv, total_price
    ], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao processar o pedido', error: err });
        }

        const orderId = results.insertId; // ID do pedido criado

        // Preparar os dados para a tabela 'order_items'
        const orderItems = items.map(item => [
            orderId,      // ID do pedido
            item.id,      // ID do produto
            item.quantity,// Quantidade do produto
            item.price,    // Preço do produto
            item.name
        ]);

        // Inserir os itens na tabela 'order_items'
        const insertItemsQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price, name) 
            VALUES ?
        `;

        db.query(insertItemsQuery, [orderItems], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao adicionar itens ao pedido', error: err });
            }

            // Atualizar a quantidade dos produtos na tabela 'products'
            const updateProductQuantities = (index = 0) => {
                if (index >= items.length) {
                    // Finalizou as atualizações de estoque
                    return res.status(200).json({
                        message: 'Pedido realizado com sucesso!',
                        order_id: orderId
                    });
                }

                const item = items[index];
                const updateQuery = `
                    UPDATE products
                    SET stock = stock - ? 
                    WHERE id = ? AND stock >= ?
                `;

                db.query(updateQuery, [item.quantity, item.id, item.quantity], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Erro ao atualizar estoque dos produtos', error: err });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(400).json({
                            message: `Quantidade insuficiente no estoque para o produto ID: ${item.id}`
                        });
                    }

                    // Chama recursivamente para o próximo item
                    updateProductQuantities(index + 1);
                });
            };

            // Iniciar atualização dos produtos
            updateProductQuantities();
        });
    });
};

module.exports = { createOrder };
