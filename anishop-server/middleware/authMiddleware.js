const jwt = require('jsonwebtoken');
const secretKey = '123456789';  // Substitua pela sua chave secreta

// Middleware para verificar o token e extrair o userId
const authenticate = (req, res, next) => {
    // Obtém o token do cabeçalho de autorização (formato: "Bearer <token>")
    const token = req.headers['authorization']?.split(' ')[1];

    // Se não houver token, retorna erro 403 (Proibido)
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Verifica a validade do token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Adiciona o userId ao request para uso nas próximas etapas
        req.userId = decoded.id;  // Acesse 'decoded.id' conforme a estrutura do token gerado

        // Passa para o próximo middleware ou rota
        next();
    });
};

module.exports = authenticate;
