import { Sequelize} from "sequelize-typescript";
import {Users} from '../models/users';
import {Token} from "../models/token";

const connection = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "logintest",
    password: "***",
    database: "logintest",
    logging: false,
    models: [Users,Token]
});

export default connection;