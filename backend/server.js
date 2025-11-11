const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const routes = require('./src/api/routes');
app.use('/api', routes);


app.get('/', (req, res) => {
    res.send('Pokémon API Gateway funcionando.');
});


app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});