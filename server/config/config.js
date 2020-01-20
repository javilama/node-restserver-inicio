// ===========================
// Puerto
// ===========================

process.env.PORT = process.env.PORT || 3000;

// ===========================
// Entorno
// ===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Expiracion de token 
// ===========================
process.env.EXP_TOKEN = 60 * 60 * 24 * 30;
// ===========================
// SEED AUTH 
// ===========================

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'seed-desarrollo';


// ===========================
// Base de Datos
// ===========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;