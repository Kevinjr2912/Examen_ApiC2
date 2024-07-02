const express = require('express');
const router = express.Router();
const administradoresControllers = require('../controllers/administradores');

//Rutas para los endpoints CRUD
router.post('/', administradoresControllers.addAdmin);
router.get('/obtenerUsuarios/', administradoresControllers.getAllAdministradores);
router.put('/:id', administradoresControllers.updateAdmin);
router.delete('/:id', administradoresControllers.deleteAdmin)

router.get('/loguearse/', administradoresControllers.login);

module.exports = router;