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
async function modificarUsuario (id, nombre, balance){
    const client = await pool.connect()
    try {
        const resp = await client.query({
            text: `update usuarios set id = $1,
                   nombre = $2,
                   balance = $3
                   where id = $1 returning *`,
            values: [id, nombre, balance]       
        })
    } catch (error) {
        console.error(error)
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
async function agregarTransferencia (emisor, receptor, monto) {
    const client = await pool.connect()
    try {
        const idReceptor= await client.query(
          `select id from usuarios where nombre=$1`,
          [receptor]
      )
      const idemisor= await client.query(
        `select id from usuarios where nombre=$1`,
        [emisor]
    )
        const resp = await client.query(`insert into transferencias (emisor, receptor, monto) values ($1, $2, $3)`,
        [idemisor, idReceptor, monto])
        console.log('Transferencia agregada con éxito');
    } catch (error) {
        console.error(error)
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