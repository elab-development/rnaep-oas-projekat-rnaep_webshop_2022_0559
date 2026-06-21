const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`🚀 Auth Service je uspešno pokrenut na portu ${PORT}`);
    console.log(`📡 Spreman za komunikaciju sa API Gateway-om!`);
});