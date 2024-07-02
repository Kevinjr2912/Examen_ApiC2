require("dotenv").config();

//Cargar las variables de entorno
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Configuración de la conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Conexión a la base de datos MySQL establecida");
});

// Middleware de autenticación
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Prohibido (token inválido)
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401); // No autorizado (sin token)
  }
};

//Loguearse
exports.login = async (req, res) => {
    const { email, contrasena } = req.body;
  
    db.query("Select * from administradores where email = ?",[email],async (err, result) => {
        if (err) {
          res.status(500).send("Error en el servidor");
          throw err;
        }
        if (result.length === 0) {
          return res.status(401).send("Invalido");
        }
        const user = result[0];
        console.log(user.contrasena);
        //Verificar contraseña (con bcrypt)
  
        const validPassword = await bcrypt.compare(contrasena, user.contrasena);
        if (!validPassword) {
          return res.status(401).send("Credenciales invalidas");
        }
        //generar JWT
        const token = jwt.sign({ id: user.id_admin }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        res.json({ token });
      }
    );
  };

//Agregar administradores
exports.addAdmin = (req, res) => {
  const newUser = req.body;
  
  // Hashear la contraseña antes de guardarla (bcrypt)
  bcrypt.hash(newUser.contrasena, 10, (err, hash) => {
    // 10 es el número de rondas de hashing
    if (err) {
      res.status(500).send("Error al hashear la contraseña");
      throw err;
    }

    newUser.contrasena = hash;

    db.query(
      "insert into administradores values (?,?,?,?)",
      [newUser.id_admin, newUser.nombre, newUser.email, newUser.contrasena],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al agregar el usuario");
          throw err;
        }
        res.status(201).send("Usuario agregado correctamente");
      }
    );
  });
};

//Obtener todos los administradores
exports.getAllAdministradores = [authenticateJWT, (req, res) => {
    db.query('SELECT * FROM administradores', (err, result) => {
      if (err) {
        res.status(500).send('Error al obtener los usuarios');
        throw err;
      }
      res.json(result);
    });
}];

// Actualizar un elemento existente
exports.updateAdmin = [authenticateJWT, (req, res) => {
    const adminId = req.params.id;
    const updatedUser = req.body;

    db.query('UPDATE administradores SET ? WHERE id_admin = ?', [updatedUser, adminId], (err, result) => {
      if (err) {
        res.status(500).send('Error al actualizar el elemento');
        throw err;
      }
      console.log('Administrador actualizado');
      res.status(200).send('Elemento actualizado exitosamente');
    });
}];

// Eliminar un elemento
exports.deleteAdmin = [authenticateJWT, (req, res) => {
    const adminId = req.params.id;
    db.query('DELETE FROM administradores WHERE id_admin = ?', adminId, (err, result) => {
      if (err) {
        res.status(500).send('Error al eliminar el elemento');
        throw err;
      }
      res.send('Elemento eliminado correctamente');
    });
}];

