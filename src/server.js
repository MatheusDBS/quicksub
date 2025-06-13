require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar rotas (serão criadas depois)
const userRoutes = require('./routes/userRoutes');
const servicoRoutes = require('./routes/servicoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const assinaturaRoutes = require('./routes/assinaturaRoutes');
app.use('/api/users', userRoutes);
app.use('/api/servicos', servicoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/assinaturas', assinaturaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
