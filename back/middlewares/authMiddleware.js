const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del header
  
  console.log("Token recibido:", token); // Log para verificar que llega el token

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    console.log("Token decodificado:", decoded); // Log para verificar el contenido del token
    req.user = decoded; // Guarda los datos del usuario en `req.user`
    next(); // Continua con la petición
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

module.exports = verifyToken;

