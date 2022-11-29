/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import db from './models';
import dbConfig from './config/db.config';

const app = express();
const PORT = process.env.PORT || 8080;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    console.log('Successfully connect to MongoDB...');
  })
  .catch(err => {
    console.log('Connection error: ', err);
    process.exit();
  });

const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-url-encoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "some-session",
    secret: "COOKIE_SECRET",
    httpOnly: true,
  })
);

// routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome hello world!!!!!"});
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
