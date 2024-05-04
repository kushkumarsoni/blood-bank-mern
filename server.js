const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')

//env config
dotenv.config();

//database connection
connectDB();

//rest obect
const app = express()

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use("/api/v1/auth",require('./routes/authRoutes'))
app.use("/api/v1/inventory",require('./routes/inventoryRoutes'));
app.use("/api/v1/analytics",require('./routes/analyticsRoutes'));
app.use("/api/v1/admin",require('./routes/adminRoutes'));

const PORT = process.env.PORT || 7000

//test route
// app.get("/",(req,res)=>{
//     res.status(200).json({
//         'message':"Welcome to blood bank mern stack application"
//     });
// });

//port
const port = 7000

app.listen(PORT, () => console.log(`Server is running in ${process.env.DEV_MODE} mode on port ${port}!`.bgGreen.white))