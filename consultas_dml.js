//importamos la configuracion de la conceccion
const { Pool } = require('pg')
const {config} = require('./db.js')
//creamos el cliente 
const pool = new Pool(config)
//.Agregar usuario
 async function agregarUsuario (nombre, balance) {
    // 1. Solicito un 'cliente' al pool de conexiones
    const client = await pool.connect()
    try {
        const resp = await client.query(
            `insert into usuarios (nombre, balance) values ($1, $2) returning *`, 
            [nombre, balance]
        )
        console.log('Usuario agregada con éxito');
    } catch (error) {
        console.error(error)
    }
    client.release()
  }
//.Devuelve todos los usuarios con sus balances 
async function mostrarUsuarios(){
    const client = await pool.connect()
    let res;
    try {
        res = await client.query({
            text:'select * from usuarios;',
            name: 'usuarios'
        }) 
    } catch (error) {
        console.error(error)
    }
    client.release()
    return res.rows
  }
//.Recibe los datos modificados de un usuario y los actualiza
async function modificarUsuario (nombre, balance, id){
    const client = await pool.connect()
    try {
        const resp = await client.query({
            text: `update usuarios set nombre=$1,
                   balance=$2
                   where id=$3`,
            values: [nombre, balance, id]       
        })
    } catch (error) {
        console.log(error)
    }
    client.release()
  }
//.Elimina usuario por id
async function eliminarUsuario (id) {
    const client = await pool.connect()
    try {
        await client.query(`delete from transferencias where emisor=${id} or receptor=${id};`)
        await client.query(`delete from usuarios where id=${id};`)
        console.log('Usuario eliminado con éxito');
    } catch (error) {
        console.error(error)
    }
    client.release()
  }
//. Recibe datos para una trasferencia 
const agregarTransferencia = async (emisor, receptor, monto_string) =>{
    let monto = parseInt(monto_string)
    if(isNaN(monto)){
        alert('El numero debe ser entero');
    }
    if(monto <= 0){
        alert('El monto debe ser mayor que cero');
    }
    const client = await pool.connect()

    const el_emisor = await client.query({
        text: 'select * from usuarios where nombre=$1',
        values: [emisor]
    })
    const el_receptor = await client.query({
        text: 'select * from usuarios where nombre=$1',
        values: [receptor]
    })

    //. Validar que el emisor tenga fondos suficientes
    if(el_emisor.rows[0].balance < monto){
        alert('El monto es mayor a su balance. pobretón');
    }
    if(el_emisor.rows[0].id === el_receptor.rows[0].id){
        alert('Receptor no debe ser el emisor')
    }
    
    try {
        await client.query('insert into transferencias (emisor, receptor, monto) values ($1, $2, $3)',
        [el_emisor.rows[0].id, el_receptor.rows[0].id, monto])

        const descuento = el_emisor.rows[0].balance - monto;
        const transfe = el_receptor.rows[0].balance + monto;

        await client.query(`update usuarios set balance=${descuento} where id=${el_emisor.rows[0].id}`)
        await client.query(`update usuarios set balance=${transfe} where id=${el_receptor.rows[0].id}`)
    } catch (error) {
        console.log(error)
    }
    client.release()

}
//.Devuelve todas las transferencias 
async function mostrarTransferencias(){
    const client = await pool.connect()
    let res;
    try {
        res = await client.query({
            text:'select transferencias.id, emisores.nombre as emisor, receptores.nombre as receptor, monto, fecha from transferencias join usuarios as emisores on emisor=emisores.id join usuarios as receptores on receptor=receptores.id',
            rowMode:'array'
        }) 
    } catch (error) {
        console.error(error)
    }
    client.release()
    return res.rows
  }
module.exports = { 
    agregarUsuario,
    mostrarUsuarios, 
    eliminarUsuario, 
    modificarUsuario, 
    agregarTransferencia, 
    mostrarTransferencias};