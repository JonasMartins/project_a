async function connect() {
    if (global.connection)
        return global.connection.connect();

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: 'postgres://dev:dev$2021@127.0.0.1:5432/sandbox'
    });

    //apenas testando a conexão
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");

    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();

    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}

async function selectUsers() {
    const client = await connect();
    const res = null;
    
    try {
        
        res = await client.query('SELECT * FROM users');

        if(!res.length)
            return res.status(404).send({ message: 'Users not found'});

        return res.rows ;
    } finally {
        pool.releaseConnection(client);
    }
    
}

module.exports = { selectUsers }

