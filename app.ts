import 'module-alias/register';
import { config } from 'dotenv';
import cors from 'cors';
import http from 'http';
import express from 'express';
import { connect } from '@helpers/connect';
import { URLS } from '@constants/urls';
import userRoute from '@routes/user.route';
import postsRoute from '@routes/posts.route';

config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(URLS.api, userRoute);
app.use(URLS.api, postsRoute);

const server = http.createServer(app);
connect(server);
