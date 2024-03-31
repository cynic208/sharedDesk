const neo4j = require('neo4j-driver');

const uri = "bolt://neo4j:7687"; 
const user = "neo4j";
const password = "JAISL_104911_!?"; 

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const session = driver.session();

module.exports = { driver, session };
