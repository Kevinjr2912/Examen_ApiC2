const express = require('express');
const router = express.Router();
const publicacionesControllers = require('../controllers/publicaciones');

//Rutas para los endpoints CRUD
router.post('/', publicacionesControllers.addPublicacion);
router.get('/obtenerPublicaciones/', publicacionesControllers.getAllPublicaciones);
router.put('/:id', publicacionesControllers.updatePublicacion);
router.delete('/:id', publicacionesControllers.deletePublicacion);

module.exports = router;