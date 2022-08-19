const express = require('express');
const { 
    agregarUsuario,
    mostrarUsuarios, 
    eliminarUsuario, 
    modificarUsuario, 
    agregarTransferencia, 
    mostrarTransferencias} = require('./consultas_dml')
const app = express()
app.use(express.static(__dirname +'/public'))
function getForm(req) {
    return new Promise((res, rej) => {
      let str = "";
      req.on("data", function (chunk) {
        str += chunk;
      });
      req.on("end", function () {
        //console.log('str', str);
        const obj = JSON.parse(str);
        res(obj);
      });
    });
}
//_____________________rutas_____________________
//.Aplicación cliente 
app.get('/', async (req, res) =>{
})
//.mostrar usuarios
app.get('/usuarios', async (req, res) => {
    const datos = await mostrarUsuarios()
    res.json(datos)
}
);
//.Recibe datos nuevo usuario
app.post('/usuario', async (req, res) => {
  const datos = await getForm (req)
  console.log(datos)
  await agregarUsuario (datos.nombre, datos.balance)
  res.json({})
}
);
//.Recibe datos modificados y los actualiza
app.put('/usuario', async (req, res) => {
    const id = req.query.id;
    const datos = await getForm(req)
    modificarUsuario(datos.nombre, datos.balance, id)
    res.end()
}
);
//.Recibe id usuario y lo elimina 
app.delete('/usuario', async (req, res) => {
    const id = req.query.id;
    eliminarUsuario(id)
    res.end()
}
);
//.Recibe datos para realizar una transferencia 
app.post('/transferencia', async (req, res) => {
  const datos = await getForm (req)
  console.log(datos)
  await agregarTransferencia (datos.emisor, datos.receptor, datos.monto)
  res.json({})
}
);
//.Devuelve transferencias en forma de arreglo
app.get('/transferencias', async (req, res) => {
    const datos = await mostrarTransferencias()
    res.json(datos)
}
);
app.get('*', (req, res) =>{
    res.send('Página no implementada')
});
app.listen(3000, function() {
    console.log('servidor ejecutado correctamente');
});

