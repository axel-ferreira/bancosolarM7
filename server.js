const express = require('express');
const { 
    agregarUsuario,
    mostrarUsuarios, 
    eliminarUsuario, 
    modificarUsuario, 
    agregarTransferencia, 
    mostrarTransferencias,
  } = require('./consultas_dml')
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

//.mostrar usuarios
app.get('/usuarios', async (req, res) => {
    let usuarios;
    try {
      usuarios = await mostrarUsuarios()
    } catch (error) {
      console.log(error)
    }
    res.json(usuarios)
}
);
//.Recibe datos nuevo usuario
app.post('/usuario', async (req, res) => {
  const datos = await getForm (req)
  console.log(datos)
  try {
    await agregarUsuario (datos.nombre, datos.balance)
  } catch (error) {
    console.log(error)
  }
  res.json({})
}
);
//.Recibe datos modificados y los actualiza
app.put('/usuario', async (req, res) => {
    const datos = await getForm(req)
    const id = req.query.id;
    try {
      await modificarUsuario(id, datos.nombre, datos.balance)
    } catch (error) {
      console.log(error)
    }
    res.json({})
}
);
//.Recibe id usuario y lo elimina 
app.delete('/usuario', async (req, res) => {
    const id = req.query.id;
    try {
      await eliminarUsuario(id)
    } catch (error) {
      console.log(error)
    }
    res.json({})
}
);


//.Recibe datos para realizar una transferencia 
app.post('/transferencia', async (req, res) => {
  const datos = await getForm (req)
  console.log(datos)
  try {
    await agregarTransferencia (datos.emisor, datos.receptor, datos.monto)
  } catch (error) {
    res.statusCode = 400
    return res.json({error: error})
  }
  res.json({})
}
);
//.Devuelve transferencias en forma de arreglo
app.get('/transferencias', async (req, res) => {
    let datos;
  try {
      datos = await mostrarTransferencias()
    } catch (error) {
      console.log(error)
    }
    res.json(datos)
}
);
app.get('*', (req, res) =>{
    res.send('Página no implementada')
});
app.listen(3000, function() {
    console.log('servidor ejecutado correctamente');
});

