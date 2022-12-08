import './App.css'
import { Corpus } from 'tiny-tfidf'
import stopwords from 'stopwords-sv'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
import * as d3 from 'd3'
import Input from './components/Input'
import BeerCard from './components/BeerCard'
import wineData from './utils/wine.csv'
import Slider from './components/Slider.js';
import beerData from './utils/products.csv'
import Instructions from './components/Instructions'

const beerDB = beerData;
const wineDB = wineData;

//Temp bool
let bBeer = true;
// console.log(data) 
let dataSet = "";
let placeholderText = ""; 

if(bBeer) {
  dataSet = "beer";
  placeholderText = "Sök på en öl du gillar";
  bBeer = !bBeer;
  console.log("Changed to beer");
} else {
  dataSet = "wine";
  placeholderText = "Sök på ett vin du gillar";
  bBeer = !bBeer;
  console.log("Changed to wine");
}


let allBeers = []
let allWines = []

const beerToString = beer => {
  const properties = [
    beer.productNameBold,
    beer.productNameThin,
    beer.categoryLevel1,
    beer.categoryLevel2,
    beer.categoryLevel3,
    beer.usage,
    beer.taste,
    beer.aroma
  ]
  // console.log(beer)
  // console.log(properties.join(' '))
  return properties.join(' ')
}
// read data from db.json and add id to each beer
const loadBeers = async () => {
  await d3.csv(beerDB, (d) => {
    allBeers.push(d)
  })
  allBeers = removeDuplicates(allBeers)
  allBeers = allBeers.map(beer => {
    return { ...beer, id: uuidv4() }
  })
  // console.log(allBeers[0])
  // console.log(beerToString(allBeers[0]))
  return allBeers.map(beer => beerToString(beer))
}

const loadWines = async () => {
  await d3.csv(wineDB, (d) => {
    allWines.push(d)
  })
  allWines = removeDuplicates(allWines)
  allWines = allWines.map(wine => {
    return { ...wine, id: uuidv4() }
  })
  return allWines.map(wine => beerToString(wine))
}
     

const removeDuplicates = beers => {
  const textBeers = beers.map((beer) => JSON.stringify(beer))
  const uniq = new Set(textBeers)
  return Array.from(uniq).map(item => JSON.parse(item))
}

const App = () => {
  const [corpus, setCorpus] = useState()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [subTitle, setSubtitle] = useState('')

  const createCorpus = async () => {
    const beers = await loadBeers()
    //console.log(beers)
    const documentTitles = beers.map((beer, i) => i.toString())
    //console.log(documentTitles)
    const corpus = new Corpus(
      documentTitles,
      beers,
      false,
      stopwords
    )
    setCorpus(corpus)
    corpus.getResultsForQuery('ale') // initiate learner
    setLoading(false)
  }
  useEffect(() => {
    createCorpus().catch(error => console.log(error, 'error creating corpus'))
  }, [])

  const search = (text) => {
    //console.log(text)
    if (corpus != null) {
      const result = corpus.getResultsForQuery(text).slice(0, 50)
      setResults(result.map(item => {
        return {
          beer: allBeers[Number(item[0])],
          similarity: Number(item[1])          
        }
      }))
    }
  }

  const handleInput = (text) => {
    setSubtitle('')
    search(text)
  }

  //Vissa öl har inget namn på thin, ändrar då titeln till att endast visa namnet på bold
  const findSimilar = (beer) => {
    if(dataSet === "wine") {
      if(beer.productNameBold === "") {
        setSubtitle('Vin som liknar ' + beer.productNameThin);
      } else {
      setSubtitle('Vin som liknar ' + beer.productNameBold);
      }
    }
    else { 
      if(beer.productNameThin === "") {
        setSubtitle('Öl som liknar ' + beer.productNameBold);
      } else {
      setSubtitle('Öl som liknar ' + beer.productNameThin);
      }
    }
    search(beerToString(beer))
  }

  

  return (
    <div className='App'>
      <div className='header'>
            <div id="switch">
              <Slider db={dataSet}/>             
            </div>
            <div id="temp"></div>
            <div id="searchDiv"><Input onChange={handleInput} text={placeholderText}/></div>           
            <div id="similar"><p>{subTitle}</p></div>
      </div>

      <div className='cardDisplay'>
        {loading && <div className="loadingScreen"><h1>Laddar in databas!</h1></div>}

        {!loading && results.length === 0 && 
          <Instructions db={dataSet}/>
        }             
        {!loading && results.map(result => {
          
          return (
            <BeerCard beerData={result} key={result.beer.id} onClick={findSimilar} />            
          )
        })}
      </div>
    </div>
  )
}

export default App
