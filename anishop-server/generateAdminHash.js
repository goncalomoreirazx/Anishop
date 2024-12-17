const bcrypt = require('bcrypt');

const password = 'admin123456789';

bcrypt.hash(password, 10).then(hash => {
  console.log('Novo hash para senha admin:', hash);
}).catch(err => {
  console.error('Erro ao gerar hash:', err);
});