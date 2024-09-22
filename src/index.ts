import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const port = process.env.PORT || 8080;
const app = express();

app.use(
    cors({
        credentials: true,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 request per windowsMs
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on http://localhost:/${port}`);
});

app.use(limiter);

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error('Missing MONGO_URL environment variable');
    process.exit(1);
}

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());
