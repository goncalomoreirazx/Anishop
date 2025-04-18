const db = require('../db/connection');

// Controlador para buscar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.*, GROUP_CONCAT(pg.genre) as genres
      FROM products p
      LEFT JOIN product_genres pg ON p.id = pg.product_id
      GROUP BY p.id
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error('Erro ao buscar os produtos:', error);
        return res.status(500).json({ message: 'Erro ao buscar os produtos.' });
      }
      
      // Converter a string de gêneros em array
      const productsWithGenres = results.map(product => ({
        ...product,
        genres: product.genres ? product.genres.split(',') : [],
        // Calculate discounted price if discount is present
        final_price: product.discount_percentage > 0 
          ? parseFloat((product.price * (1 - product.discount_percentage / 100)).toFixed(2)) 
          : product.price
      }));
      
      res.json(productsWithGenres);
    });
  } catch (error) {
    console.error('Erro ao buscar os produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar os produtos.' });
  }
};

// Controlador para buscar produto por ID
const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.category,
        p.stock, 
        p.image_url AS mainImage,
        p.discount_percentage,
        GROUP_CONCAT(DISTINCT pg.genre) as genres,
        GROUP_CONCAT(DISTINCT pi.image_url) as additionalImages
      FROM products p
      LEFT JOIN product_genres pg ON p.id = pg.product_id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `;

    db.query(query, [productId], (error, results) => {
      if (error) {
        console.error('Erro ao buscar o produto:', error);
        return res.status(500).json({ message: 'Erro ao buscar o produto.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
      }

      // Organizar os resultados
      const product = {
        id: results[0].id,
        name: results[0].name,
        description: results[0].description,
        price: results[0].price,
        category: results[0].category,
        stock: results[0].stock,
        mainImage: results[0].mainImage,
        discount_percentage: results[0].discount_percentage || 0,
        final_price: results[0].discount_percentage > 0 
          ? parseFloat((results[0].price * (1 - results[0].discount_percentage / 100)).toFixed(2)) 
          : results[0].price,
        genres: results[0].genres ? results[0].genres.split(',') : [],
        images: results[0].additionalImages ? results[0].additionalImages.split(',') : []
      };

      res.json(product);
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// New controller to apply discounts to products
const applyDiscount = async (req, res) => {
  try {
    const { productIds, discountPercentage } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'You must select at least one product.' });
    }
    
    if (discountPercentage === undefined || isNaN(discountPercentage)) {
      return res.status(400).json({ message: 'You must provide a valid discount percentage.' });
    }
    
    // Validate discount percentage is between 0 and 100
    const percentage = parseFloat(discountPercentage);
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: 'Discount percentage must be between 0 and 100.' });
    }
    
    // Create placeholders for the products IDs for the SQL query
    const placeholders = productIds.map(() => '?').join(',');
    
    // Update products with the discount
    const query = `
      UPDATE products 
      SET discount_percentage = ? 
      WHERE id IN (${placeholders})
    `;
    
    db.query(query, [percentage, ...productIds], (error, results) => {
      if (error) {
        console.error('Error applying discount:', error);
        return res.status(500).json({ message: 'Error applying discount.' });
      }
      
      res.json({ 
        message: 'Discount applied successfully!',
        affectedProducts: results.affectedRows
      });
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    res.status(500).json({ message: 'Server error while applying discount.' });
  }
};

// Controlador para adicionar um produto
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, genres, stock, image_url, discount_percentage = 0 } = req.body;
    
    console.log('Dados recebidos:', req.body);
    
    // Verifique se todos os campos obrigatórios estão presentes
    if (!name || !description || !price || !category || !genres || !genres.length || stock === undefined || !image_url) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    
    // Verifique se 'price' e 'stock' são numéricos
    if (isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ message: 'Os campos "price" e "stock" devem ser números válidos.' });
    }
    
    // Converta para números
    const priceNumeric = parseFloat(price);
    const stockNumeric = parseInt(stock, 10);
    const discountNumeric = parseFloat(discount_percentage) || 0;
    
    // Usar transação para garantir que tanto o produto quanto seus gêneros sejam salvos
    db.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Primeiro, insere o produto
        const insertProductQuery = `
          INSERT INTO products (name, description, price, category, stock, image_url, discount_percentage)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const productValues = [name, description, priceNumeric, category, stockNumeric, image_url, discountNumeric];
        
        db.query(insertProductQuery, productValues, async (error, results) => {
          if (error) {
            return db.rollback(() => {
              throw error;
            });
          }

          const productId = results.insertId;

          // Depois, insere os gêneros
          const insertGenresQuery = `
            INSERT INTO product_genres (product_id, genre)
            VALUES ?
          `;
          const genreValues = genres.map(genre => [productId, genre]);

          db.query(insertGenresQuery, [genreValues], (error) => {
            if (error) {
              return db.rollback(() => {
                throw error;
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  throw err;
                });
              }
              res.status(201).json({ 
                message: 'Produto adicionado com sucesso!', 
                id: productId 
              });
            });
          });
        });
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    console.error('Erro ao adicionar o produto:', error);
    res.status(500).json({ message: 'Erro ao adicionar o produto.' });
  }
};

// Controlador para atualizar um produto
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, genres, stock, image_url, discount_percentage } = req.body;

  try {
    db.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Atualiza os dados básicos do produto
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
        if (discount_percentage !== undefined) {
          fields.push('discount_percentage = ?');
          values.push(discount_percentage);
        }
        
        if (fields.length > 0) {
          const updateProductQuery = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
          values.push(id);
          
          await new Promise((resolve, reject) => {
            db.query(updateProductQuery, values, (error, results) => {
              if (error) reject(error);
              else resolve(results);
            });
          });
        }

        // Atualiza os gêneros se foram fornecidos
        if (genres && genres.length > 0) {
          // Remove gêneros antigos
          await new Promise((resolve, reject) => {
            db.query('DELETE FROM product_genres WHERE product_id = ?', [id], (error) => {
              if (error) reject(error);
              else resolve();
            });
          });

          // Insere novos gêneros
          const insertGenresQuery = `
            INSERT INTO product_genres (product_id, genre)
            VALUES ?
          `;
          const genreValues = genres.map(genre => [id, genre]);

          await new Promise((resolve, reject) => {
            db.query(insertGenresQuery, [genreValues], (error) => {
              if (error) reject(error);
              else resolve();
            });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              throw err;
            });
          }
          res.json({ message: 'Produto atualizado com sucesso!' });
        });
      } catch (error) {
        throw error;
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar o produto.' });
  }
};

// Rest of your controller functions
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if the product exists
    const checkQuery = 'SELECT * FROM products WHERE id = ?';
    
    db.query(checkQuery, [id], (error, results) => {
      if (error) {
        console.error('Error checking product:', error);
        return res.status(500).json({ message: 'Error checking product.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      // If product exists, delete it
      const deleteQuery = 'DELETE FROM products WHERE id = ?';
      
      db.query(deleteQuery, [id], (error) => {
        if (error) {
          console.error('Error deleting product:', error);
          return res.status(500).json({ message: 'Error deleting product.' });
        }

        res.json({ message: 'Product deleted successfully.' });
      });
    });
  } catch (error) {
    console.error('Error in delete product:', error);
    res.status(500).json({ message: 'Server error while deleting product.' });
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
      p.discount_percentage,
      SUM(oi.quantity) as total_sold,
      SUM(oi.quantity * oi.price) as total_revenue
    FROM 
      products p
    JOIN 
      order_items oi ON p.id = oi.product_id
    GROUP BY 
      p.id, p.name, p.description, p.price, p.image_url, p.discount_percentage
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
      const formattedResults = results.map(product => {
        const hasDiscount = product.discount_percentage > 0;
        const finalPrice = hasDiscount 
          ? parseFloat((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
          : product.price;
          
        return {
          ...product,
          total_sold: parseInt(product.total_sold),
          total_revenue: parseFloat(product.total_revenue).toFixed(2),
          final_price: finalPrice,
          has_discount: hasDiscount
        };
      });
      
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
        category,
        discount_percentage
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

        // Map results to include full image URL and final price
        const relatedProducts = results.map(product => {
          const hasDiscount = product.discount_percentage > 0;
          const finalPrice = hasDiscount 
            ? parseFloat((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
            : product.price;
            
          return {
            ...product,
            image_url: `http://localhost:5000/assets/images/${product.image_url}`,
            final_price: finalPrice,
            has_discount: hasDiscount
          };
        });

        res.status(200).json(relatedProducts);
      }
    );
  });
};

// Controller para produtos filtrados
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

    const formattedResults = results.map(product => {
      const hasDiscount = product.discount_percentage > 0;
      const finalPrice = hasDiscount 
        ? parseFloat((product.price * (1 - product.discount_percentage / 100)).toFixed(2))
        : product.price;
        
      return {
        ...product,
        total_sold: parseInt(product.total_sold),
        final_price: finalPrice,
        has_discount: hasDiscount
      };
    });

    res.json(formattedResults);
  });
};

// Remove discounts from products
const removeDiscounts = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'You must select at least one product.' });
    }
    
    // Create placeholders for the products IDs for the SQL query
    const placeholders = productIds.map(() => '?').join(',');
    
    // Update products to remove discounts
    const query = `
      UPDATE products 
      SET discount_percentage = 0 
      WHERE id IN (${placeholders})
    `;
    
    db.query(query, [...productIds], (error, results) => {
      if (error) {
        console.error('Error removing discounts:', error);
        return res.status(500).json({ message: 'Error removing discounts.' });
      }
      
      res.json({ 
        message: 'Discounts removed successfully!',
        affectedProducts: results.affectedRows
      });
    });
  } catch (error) {
    console.error('Error removing discounts:', error);
    res.status(500).json({ message: 'Server error while removing discounts.' });
  }
};

module.exports = { 
  getAllProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  addProductImage, 
  getMostSoldProducts, 
  getProductReviews, 
  addProductReview, 
  getRelatedProducts, 
  getFilteredProducts,
  applyDiscount,
  removeDiscounts
};