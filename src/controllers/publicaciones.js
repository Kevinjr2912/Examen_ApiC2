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


//Agregar administradores
exports.addPublicacion = [authenticateJWT,(req, res) => {
    const newPublic = req.body;
    db.query(
        "insert into publicaciones values (?,?,?,?)",
        [newPublic.idpublicaciones, newPublic.titulo, newPublic.contenido, newPublic.admin_id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error al agregar una publicación");
            throw err;
          }
          res.status(201).send("Publicación agregado exitosamente");
        }
      );
}];
  
  //Obtener todas las publicaciones
  exports.getAllPublicaciones = [authenticateJWT, (req, res) => {
      db.query('SELECT * FROM publicaciones', (err, result) => {
        if (err) {
          res.status(500).send('Error al obtener las publicaciones');
          throw err;
        }
        res.json(result);
      });
  }];
  
  // Actualizar un publicación existente
  exports.updatePublicacion = [authenticateJWT, (req, res) => {
      const publicId = req.params.id;
      const updatedPublicacion = req.body;

      console.log(publicId)
      console.log(updatedPublicacion)
  
      db.query('UPDATE publicaciones SET ? WHERE idpublicaciones = ?', [updatedPublicacion, publicId], (err, result) => {
        if (err) {
          res.status(500).send('Error al actualizar dicha publicación');
          throw err;
        }
        res.status(200).send('Publicación actualizada');
      });
  }];
  
  // Eliminar una publicación
  exports.deletePublicacion = [authenticateJWT, (req, res) => {
      const publicId = req.params.id;
      db.query('DELETE FROM publicaciones WHERE idpublicaciones = ?', publicId, (err, result) => {
        if (err) {
          res.status(500).send('Error al eliminar el elemento');
          throw err;
        }
        res.send('Elemento eliminado correctamente');
      });
  }];
