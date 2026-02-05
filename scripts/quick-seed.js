const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin@2026';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash:', hash);
}

generateHash();
