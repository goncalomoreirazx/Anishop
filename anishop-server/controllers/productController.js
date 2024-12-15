const db = require('../db/connection'); // Ajuste o caminho para o seu arquivo de conexão com o banco de dados

// Controlador para buscar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const query = `SELECT * FROM products`; // Realiza o SELECT * para pegar todos os dados

    db.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao buscar os produtos:', error);
        return res.status(500).json({ message: 'Erro ao buscar os produtos.' });
      }

      
      res.json(results); // Retorna os resultados da consulta para o cliente
    });
  } catch (error) {
    console.error('Erro ao buscar os produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar os produtos.' });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    // Consulta para buscar o produto e as imagens relacionadas
    const query = `
      SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url AS mainImage, pi.image_url AS additionalImages
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
    `;

    db.query(query, [productId], (error, results) => {
      if (error) {
        console.error('Erro ao buscar o produto:', error);
        return res.status(500).json({ message: 'Erro ao buscar o produto.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      // Organize os resultados separando a imagem principal das imagens adicionais
      const product = {
        id: results[0].id,
        name: results[0].name,
        description: results[0].description,
        price: results[0].price,
        stock: results[0].stock,
        mainImage: results[0].mainImage, // A primeira imagem é a principal
        images: results.map(result => result.additionalImages).filter(Boolean) // Imagens adicionais
      };

      res.json(product); // Retorna o produto com a imagem principal e as imagens adicionais
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};



// Controlador para adicionar um produto
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image_url } = req.body;

    console.log('Dados recebidos:', req.body);
    
    // Verifique se todos os campos obrigatórios estão presentes
    if (!name || !description || !price || !category || stock === undefined || !image_url) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Verifique se 'price' e 'stock' são numéricos
    if (isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ message: 'Os campos "price" e "stock" devem ser números válidos.' });
    }

    // Converta para números (caso não tenha sido feito no frontend)
    const priceNumeric = parseFloat(price);
    const stockNumeric = parseInt(stock, 10);

    const query = `
      INSERT INTO products (name, description, price, category, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [name, description, priceNumeric, category, stockNumeric, image_url];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Erro ao adicionar o produto:', error);
        return res.status(500).json({ message: 'Erro ao adicionar o produto.' });
      }

      console.log('Produto adicionado com sucesso:', results);
      return res.status(201).json({ message: 'Produto adicionado com sucesso!', id: results.insertId });
    });
  } catch (error) {
    console.error('Erro ao adicionar o produto:', error);
    res.status(500).json({ message: 'Erro ao adicionar o produto.' });
  }
};


// Controlador para atualizar um produto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, stock, image_url } = req.body;

  try {
    // Constrói a query dinâmica com apenas os campos fornecidos
    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (description) {
      fields.push('description = ?');
      values.push(description);
    }
    if (price !== undefined) {
      fields.push('price = ?');
      values.push(price);
    }
    if (category) {
      fields.push('category = ?');
      values.push(category);
    }
    if (stock !== undefined) {
      fields.push('stock = ?');
      values.push(stock);
    }
    if (image_url) {
      fields.push('image_url = ?');
      values.push(image_url);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo fornecido para atualização.' });
    }

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Erro ao atualizar o produto:', error);
        return res.status(500).json({ message: 'Erro ao atualizar o produto.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      console.log('Produto atualizado com sucesso:', results);
      res.json({ message: 'Produto atualizado com sucesso!' });
    });
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar o produto.' });
  }
};

// Controlador para excluir um produto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM products WHERE id = ?';

    db.query(query, [id], (error, results) => {
      if (error) {
        console.error('Erro ao excluir o produto:', error);
        return res.status(500).json({ message: 'Erro ao excluir o produto.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      console.log('Produto excluído com sucesso:', results);
      res.json({ message: 'Produto excluído com sucesso!' });
    });
  } catch (error) {
    console.error('Erro ao excluir o produto:', error);
    res.status(500).json({ message: 'Erro ao excluir o produto.' });
  }
};

// Controlador para adicinar imagem a tabela product_images
const addProductImage = (req, res) => {
  const { product_id, image_url } = req.body;

  // Add console.log for debugging
  console.log('Received request:', { product_id, image_url });

  if (!product_id || !image_url) {
    return res.status(400).json({ error: 'Produto e imagem são obrigatórios' });
  }

  const query = `
    INSERT INTO product_images (product_id, image_url)
    VALUES (?, ?)
  `;

  db.query(query, [product_id, image_url], (error, result) => {
    if (error) {
      console.error('Erro ao adicionar imagem:', error);
      return res.status(500).json({ 
        error: 'Erro ao adicionar imagem',
        details: error.message 
      });
    }

    return res.status(201).json({
      message: 'Imagem adicionada com sucesso',
      imageId: result.insertId
    });
  });
};

// Controlador para buscar os produtos mais vendidos
const getMostSoldProducts = (req, res) => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.image_url,
      SUM(oi.quantity) as total_sold,
      SUM(oi.quantity * oi.price) as total_revenue
    FROM 
      products p
    JOIN 
      order_items oi ON p.id = oi.product_id
    GROUP BY 
      p.id, p.name, p.description, p.price, p.image_url
    ORDER BY 
      total_sold DESC
    LIMIT 4
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error.message);
      return res.status(500).json({ error: 'Erro ao buscar produtos mais vendidos.' });
    }

    if (Array.isArray(results)) {
      // Formata os resultados para melhor apresentação
      const formattedResults = results.map(product => ({
        ...product,
        total_sold: parseInt(product.total_sold),
        total_revenue: parseFloat(product.total_revenue).toFixed(2)
      }));
      return res.status(200).json(formattedResults);
    } else {
      console.error('O resultado da query não é iterável:', results);
      return res.status(500).json({ error: 'Erro inesperado ao buscar produtos mais vendidos.' });
    }
  });
};

//reviews
const getProductReviews = (req, res) => {
   const productId = req.params.id;
   const query = `
     SELECT
       r.id,
       r.rating,
       r.comment,
       r.created_at,
       u.username AS userName
     FROM
       reviews r
     JOIN
       users u ON r.user_id = u.id
     WHERE
       r.product_id = ?
     ORDER BY
       r.created_at DESC
   `;

   db.query(query, [productId], (error, results) => {
     if (error) {
       console.error('Erro ao buscar reviews do produto:', error.message);
       return res.status(500).json({ error: 'Erro ao buscar reviews do produto.' });
     }

     if (Array.isArray(results)) {
       // Calcular média de ratings
       const averageRating = results.length > 0
         ? (results.reduce((sum, review) => sum + review.rating, 0) / results.length).toFixed(1)
         : 0;

       return res.status(200).json({
         reviews: results,
         averageRating: parseFloat(averageRating),
         totalReviews: results.length
       });
     } else {
       console.error('O resultado da query não é iterável:', results);
       return res.status(500).json({ error: 'Erro inesperado ao buscar reviews.' });
     }
   });
};


const addProductReview = (req, res) => {
  const { product_id, user_id, rating, comment } = req.body;

  // More robust validation
  if (!product_id || !user_id || !rating) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  // Validate rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Classificação inválida' });
  }

  const query = `
    INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [product_id, user_id, rating, comment], (error, result) => {
    if (error) {
      console.error('Erro ao adicionar review:', error.message);
      return res.status(500).json({
        error: 'Erro ao adicionar review.',
        details: error.message
      });
    }

    // Update average rating in products table (if you have such a column)
    const updateRatingQuery = `
      UPDATE products 
      SET average_rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE product_id = ?
      )
      WHERE id = ?
    `;

    db.query(updateRatingQuery, [product_id, product_id], (updateError) => {
      if (updateError) {
        console.error('Erro ao atualizar rating médio:', updateError);
      }
    });

    return res.status(201).json({
      message: 'Review adicionada com sucesso',
      reviewId: result.insertId
    });
  });
};

// Get related products
const getRelatedProducts = (req, res) => {
  const productId = parseInt(req.params.productId);

  // Validate productId
  if (isNaN(productId)) {
    return res.status(400).json({ error: 'ID de produto inválido' });
  }

  // First, find the category of the current product
  const categoryQuery = `
    SELECT category FROM products WHERE id = ?
  `;

  db.query(categoryQuery, [productId], (categoryError, categoryResults) => {
    if (categoryError) {
      console.error('Database error:', categoryError);
      return res.status(500).json({ 
        error: 'Erro ao buscar categoria do produto',
        details: categoryError.message 
      });
    }

    // If no product found
    if (categoryResults.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const category = categoryResults[0].category;

    // Ensure category exists before querying
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Query to fetch 4 random products from the same category, 
    // excluding the current product
    const relatedProductsQuery = `
      SELECT 
        id, 
        name, 
        price, 
        image_url, 
        category
      FROM products
      WHERE 
        category = ? 
        AND id != ?
      ORDER BY RAND()
      LIMIT 4
    `;

    db.query(
      relatedProductsQuery, 
      [category, productId], 
      (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ 
            error: 'Erro ao buscar produtos relacionados',
            details: error.message 
          });
        }

        // If no related products found, return empty array instead of error
        if (results.length === 0) {
          return res.status(200).json([]);
        }

        // Map results to include full image URL
        const relatedProducts = results.map(product => ({
          ...product,
          image_url: `http://localhost:5000/assets/images/${product.image_url}`
        }));

        res.status(200).json(relatedProducts);
      }
    );
  });
};

///controller para os filtros.
const getFilteredProducts = (req, res) => {
  const { priceRange, categories, sortBy } = req.query;

  let query = `
    SELECT 
      p.*,
      COALESCE(SUM(oi.quantity), 0) as total_sold
    FROM 
      products p
    LEFT JOIN 
      order_items oi ON p.id = oi.product_id
    WHERE 1=1
  `;

  const queryParams = [];

  // Price Range Filter
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (max) {
      query += ' AND p.price >= ? AND p.price <= ?';
      queryParams.push(min, max);
    } else {
      query += ' AND p.price >= ?';
      queryParams.push(min);
    }
  }

  // Categories Filter
  if (categories) {
    const categoryArray = typeof categories === 'string' ? [categories] : categories;
    if (categoryArray.length > 0) {
      query += ` AND p.category IN (${categoryArray.map(() => '?').join(',')})`;
      queryParams.push(...categoryArray);
    }
  }

  // Exclude Manga category
  query += " AND p.category != 'Manga'";

  // Group by before sorting
  query += ' GROUP BY p.id';

  // Sorting
  switch (sortBy) {
    case 'popular':
      query += ' ORDER BY total_sold DESC';
      break;
    case 'newest':
      query += ' ORDER BY p.created_at DESC';
      break;
    case 'price-low':
      query += ' ORDER BY p.price ASC';
      break;
    case 'price-high':
      query += ' ORDER BY p.price DESC';
      break;
    default:
      query += ' ORDER BY p.id DESC';
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error('Error fetching filtered products:', error);
      return res.status(500).json({ error: 'Error fetching filtered products' });
    }

    const formattedResults = results.map(product => ({
      ...product,
      total_sold: parseInt(product.total_sold)
    }));

    res.json(formattedResults);
  });
};


module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, addProductImage, getMostSoldProducts, getProductReviews, addProductReview, getRelatedProducts, getFilteredProducts};
