const jwt = require('jsonwebtoken');

// ===========================
// Verificar token
// ===========================

let tokenAuth = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err,
                tk: process.env.TOKEN_SEED
            });
        }

        req.usuario = decoded.usuario;
        next();


    });

}


module.exports = {

    tokenAuth
}