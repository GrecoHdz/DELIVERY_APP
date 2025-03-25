const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const db = require('../config/database');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Ignora errores de certificados SSL
  }
});

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, usuario: user.usuario, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, usuario: user.usuario, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

const login = async (req, res) => {
  const { usuario, clave } = req.body;

  try {
    const user = await Usuario.findOne({
      where: { usuario },
      attributes: ["id_usuario", "usuario", "clave_hash", "id_rol"]
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    const isMatch = await bcrypt.compare(clave, user.clave_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Usuario o contraseña incorrectos." });
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user.id_usuario,
      usuario: user.usuario,
      role: user.id_rol
    });

    res.json({ 
      accessToken, 
      refreshToken,
      user: {
        id: user.id_usuario,
        usuario: user.usuario,
        role: user.id_rol
      }
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Buscar el usuario por email
    const [user] = await db.query(
      'SELECT id, usuario FROM usuarios WHERE email = ?',
      [email]
    );

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró ningún usuario con ese correo electrónico'
      });
    }

    // Generar token de recuperación (expira en 1 hora)
    const resetToken = jwt.sign(
      { userId: user[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Guardar el token en la base de datos
    await db.query(
      'UPDATE usuarios SET reset_token = ?, reset_token_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?',
      [resetToken, user[0].id]
    );

    // URL de recuperación
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Enviar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña - Delivery App',
      html: `
        <h1>Recuperación de Contraseña</h1>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Se ha enviado un enlace de recuperación a tu correo electrónico'
    });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud de recuperación de contraseña'
    });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verificar que el token sea válido y no haya expirado
    const [user] = await db.query(
      'SELECT id FROM usuarios WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (!user || user.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña y limpiar el token
    await db.query(
      'UPDATE usuarios SET clave = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, user[0].id]
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al restablecer la contraseña'
    });
  }
};

module.exports = { login, generateTokens, forgotPassword, resetPassword };
