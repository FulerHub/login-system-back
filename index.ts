import express, {Express, NextFunction, Request, Response} from 'express';
import router from './routes/index';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import connection from "./config/config";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

app.use((
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    res.status(500).json({message: err.message})
});

const startApp = async ()=>{
    try {
        app.listen(PORT, ()=>{
            console.log('Server start on PORT: ',PORT)
        });
    }catch (e) {
        console.log(e)
    }
}

connection.sync().then(()=>{
    console.log('Database synced successfully!');
    startApp();
}).catch((err)=>{
    console.log("Error",err)
});




/*
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);

app.listen(port, ()=>{
    console.log('Server start on PORT: ',port)
});
*/

export default app;