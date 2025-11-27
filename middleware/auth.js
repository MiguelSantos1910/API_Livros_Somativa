const jwt = require('jsonwebtoken');
function auth(req, res, next){
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startWith("Bearer ")?authHeader.slice(7):null;
  if(!token){
    return res.status(401).json({ error: "Token ausente: " + err.message });
  }
  try{
    const payload = jwt.verify(token, process.envJWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, nome: payload.nome };
    next();
  }catch(err){
    return res.status(401).json({ error: "Token inválido ou expirado: " + err.message });
  }
};
module.exports = auth;