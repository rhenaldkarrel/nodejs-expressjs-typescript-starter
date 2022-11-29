import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';

const app = express();
const PORT = process.env.PORT || 8080;

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
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}...`);
});
