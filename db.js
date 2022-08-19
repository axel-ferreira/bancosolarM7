//clase pool con objeto de configuracion para la coneccion a la db


//configuracion de la coneccion mediante objeto con propiedades 
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'banco_solar',
    password: '9149',
    min: 5,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
    port: 5432
}
module.exports = {config};  
