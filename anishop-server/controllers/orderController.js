const db = require('../db/connection');

//Controler para obter os detalhes das orders do user 
const getLatestOrderDetails = (req, res) => {
    const userId = req.user.id; // Ensure you have auth middleware setting this

    const orderQuery = `
        SELECT * FROM orders 
        WHERE user_id = ? 
        ORDER BY order_date DESC 
        LIMIT 1
    `;

    db.query(orderQuery, [userId], (err, orderResults) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving order', error: err });
        }

        if (orderResults.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        const order = orderResults[0];

        const itemsQuery = `
            SELECT oi.*, p.name as product_name 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;

        db.query(itemsQuery, [order.id], (err, itemResults) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving order items', error: err });
            }

            res.status(200).json({
                order: order,
                items: itemResults
            });
        });
    });
};

//controller para fazer o historico de compras dos users.
const getUserOrders = (req, res) => {
    console.log('getUserOrders called');
    console.log('User ID from token:', req.userId);
  
    const userId = req.userId;
  
    const query = `
      SELECT 
        o.id as order_id,
        o.total_price,
        o.order_date,
        o.first_name,
        o.last_name,
        o.address,
        o.city,
        o.postal_code,
        GROUP_CONCAT(
          JSON_OBJECT(
            'name', oi.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.order_date DESC
    `;
  
    console.log('Executing query with userId:', userId);
  
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
          error: 'Erro ao buscar histórico de pedidos',
          details: error.message 
        });
      }
  
      console.log('Query results:', results);
  
      const orders = results.map(order => ({
        ...order,
        items: JSON.parse(`[${order.items}]`)
      }));
  
      res.status(200).json(orders);
    });
  };

// Get all orders for admin view
const getAllOrders = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Query para contar total de orders
  const countQuery = `SELECT COUNT(*) as total FROM orders`;

  // Query principal com paginação
  const query = `
      SELECT 
          o.*,
          COUNT(oi.id) as total_items,
          GROUP_CONCAT(
              JSON_OBJECT(
                  'name', oi.name,
                  'quantity', oi.quantity,
                  'price', oi.price
              )
          ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.order_date DESC
      LIMIT ? OFFSET ?
  `;

  db.query(countQuery, (countErr, countResults) => {
      if (countErr) {
          return res.status(500).json({
              error: 'Error counting orders',
              details: countErr.message
          });
      }

      const totalOrders = countResults[0].total;
      const totalPages = Math.ceil(totalOrders / limit);

      db.query(query, [limit, offset], (error, results) => {
          if (error) {
              return res.status(500).json({
                  error: 'Error fetching orders',
                  details: error.message
              });
          }

          try {
              const orders = results.map(order => ({
                  ...order,
                  items: order.items ? JSON.parse(`[${order.items}]`) : []
              }));
              
              res.status(200).json({
                  orders,
                  pagination: {
                      currentPage: page,
                      totalPages,
                      totalItems: totalOrders,
                      itemsPerPage: limit
                  }
              });
          } catch (parseError) {
              res.status(500).json({
                  error: 'Error parsing order data',
                  details: parseError.message
              });
          }
      });
  });
};

const getRecentOrdersAdmin = (req, res) => {
  // Query simples para pegar as últimas 4 orders com seus items
  const query = `
      SELECT 
          o.id,
          o.first_name,
          o.last_name,
          o.total_price,
          o.order_date,
          COUNT(oi.id) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.order_date DESC
      LIMIT 4
  `;

  db.query(query, (error, results) => {
      if (error) {
          console.error('Database error:', error);
          return res.status(500).json({
              error: 'Error fetching recent orders',
              details: error.message
          });
      }

      res.status(200).json(results);
  });
};


module.exports = { getLatestOrderDetails, getUserOrders, getAllOrders, getRecentOrdersAdmin };