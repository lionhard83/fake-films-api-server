import express, {Request, Response} from "express";
import {getFilms} from 'fake-films-sample';
import { v4 } from "uuid";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const films = getFilms().map(film => ({ ...film, id: v4() }));

console.log('films:', films);

app.get('/', (req: Request, res: Response) => {
    res.json({message: 'server runs'})
})

app.get('/films', ({query: {actor, director: directorInParams}}: Request, res: Response) => {
    let arrToFilter = [...films];
    actor && (arrToFilter = arrToFilter.filter(({actors}) => actors.includes(actor as string)))
    // if (actor) {
    //     arrToFilter = arrToFilter.filter(item => item.actors.includes(actor as string))
    // }
  
    arrToFilter = directorInParams ? 
        arrToFilter.filter(({director}) => director === directorInParams)
        : arrToFilter
    
    res.json(arrToFilter);
})

app.get('/films/:id',({params: {id : paramsId}}: Request, res: Response) => {
    const findedFilm = films.find(({id}) => id === paramsId);
    findedFilm ? res.json(findedFilm) : res.status(404).json({message: 'film not found'});
});

app.post('/films',  ({body}: Request, res: Response) => {
    // verificare che tutti i campi siano corretti
    const newFilm = {...body, id: v4()};
    films.push(newFilm);
    res.status(201).json(newFilm);
})

app.delete('/films/:id', ({params: {id : paramsId}}: Request, res: Response) => {
    const findedIndex = films.findIndex(({id}) => id === paramsId);
    findedIndex !== -1 ? 
        films.splice(findedIndex, 1) && res.json({message: 'film deleted'}) 
        : res.status(404).json({message: 'film not found'});
    // if (findedIndex !== -1) {
    //     films.splice(findedIndex, 1);
    //     res.json({message: 'film deleted'})
    // } else {
    //     res.status(404).json({message: 'film not found'});
    // }
})

app.listen(3001, () => {
    console.log('server is running')
})
