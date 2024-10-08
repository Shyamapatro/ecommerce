require('dotenv').config('../../.env')

module.exports = {
   databaseName:process.env.DATABASE_NAME,
   user:process.env.DATABASE_USER,
   password:process.env.DATABASE_PASSWORD, 
   host: process.env.DATABASE_HOST
};