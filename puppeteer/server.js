import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { run } from './rent.js';

const app = express();
const port = 3000;

app.use(cors({origin: '*' }));
app.use(express.json());

app.post('/scrape', async (req, res) => {
    try{
        const city = req.body.city;
        const minPrice = req.body.minPrice;
        const maxPrice = req.body.maxPrice;
        console.log(city, minPrice, maxPrice);
        const data = await run(city, minPrice, maxPrice);
        //const data = "data from run function";
        res.json({message: 'Completed!', data});
    } catch (error) {
        res.status(500).json({message: 'An error occured!', error});
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${chalk.green(port)}`);
});