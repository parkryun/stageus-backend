const clientOption = {
    user: process.env.PG_CLIENT_USER,
    password: process.env.PG_CLIENT_PASSWORD,
    host: process.env.PG_CLIENT_HOST,
    database: process.env.PG_CLIENT_DATABASE,
    port: 5432
}

module.exports = clientOption