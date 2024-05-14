require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// //swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); 


//connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication');

//routes
const authRouter = require('./routes/auth')
const studentsRouter = require('./routes/students')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());


app.use(express.static("public"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/students',  authenticateUser, studentsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
