const express = require('express');
const bodyParser = require('body-parser');
const administradoresRoutes = require('./routes/administradores');
const publicacionesRoutes = require('./routes/publicaciones');

const app = express();
const port = 3000;

// Middleware para analizar los cuerpos de las solicitudes
app.use(bodyParser.json());

//usar las rutas de los items
app.use('/administradores', administradoresRoutes);
app.use('/publicaciones', publicacionesRoutes);

//iniciar el servidor
app.listen(port, () =>{
    console.log(`Servidor Express en ejecución en http://localhost:${port}`);
});



