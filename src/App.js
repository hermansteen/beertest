import './App.css'
import { Corpus } from 'tiny-tfidf'
import stopwords from 'stopwords-sv'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
import * as d3 from 'd3'
import Input from './components/Input'
import BeerCard from './components/BeerCard'
import data from './utils/products.csv'

// console.log(data)

let allBeers = []
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
  await d3.csv(data, (d) => {
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
    console.log(beers)
    const documentTitles = beers.map((beer, i) => i.toString())
    console.log(documentTitles)
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
    console.log(text)
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

  const findSimilar = (beer) => {
    setSubtitle('Similar to ' + beer.productNameBold)
    search(beerToString(beer))
  }
  return (
    <div className='App'>
      <div className='header'>
        <h1>Beer search</h1>
        <Input onChange={handleInput} />
        <h2>{subTitle}</h2>
      </div>
      <div className='cardDisplay'>
        {loading && <p>Loading...</p>}
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
