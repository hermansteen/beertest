import './App.css'
import { Corpus } from 'tiny-tfidf'
import stopwords from 'stopwords-sv'
import { v4 as uuidv4 } from 'uuid'
import { useEffect, useState } from 'react'
import * as d3 from 'd3'
import Input from './components/Input'
import BeerCard from './components/BeerCard'
//import wineData from './utils/wine.csv'
import productLinks from './utils/links.csv'
import beerData from './utils/products.csv'
import Instructions from './components/Instructions'

const productDB = productData;
//const wineDB = wineData;



let allProducts = []

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

const loadProducts = async () => {
  await d3.csv(productDB, (d) => {
    allProducts.push(d)
  })
  allProducts = removeDuplicates(allProducts)
  allProducts = allProducts.map(product => {
    return { ...product, id: uuidv4()}
  })
  //add link to product
  allProducts = allProducts.map(product => {
    return { ...product, link: productLinks[product.productId]}
  })
  console.log(allProducts[0].link)

  return allProducts.map(product => beerToString(product))
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
    const products = await loadProducts()
    //console.log(beers)
    const documentTitles = products.map((beer, i) => i.toString())
    //console.log(documentTitles)
    const corpus = new Corpus(
      documentTitles,
      products,
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
          beer: allProducts[Number(item[0])],
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
  const findSimilar = (item) => {
    if (item.productNameBold === '') {
      setSubtitle('Vin som liknar ' + item.productNameThin);
    } else {
      setSubtitle('Produkter som liknar ' + item.productNameBold);
    }
    search(beerToString(item))
  }

  return (
    <div className='App'>
      <div className='header'>
        <div id="temp"></div>
        <div id="searchDiv"><Input onChange={handleInput} text="Sök på en öl/ett vin du gillar" /></div>
        <div id="similar"><p>{subTitle}</p></div>
      </div>

      <div className='cardDisplay'>
        {loading && <div className="loadingScreen"><h1>Laddar in databas!</h1></div>}

        {!loading && results.length === 0 &&
          <Instructions db="" />
        }
        {!loading && results.map(result => {

          return (
            <BeerCard beerData={result} beerLink={productLinks[result.productId]} key={result.beer.id} onClick={findSimilar} />
          )
        })}
      </div>
    </div>
  )
}

export default App
