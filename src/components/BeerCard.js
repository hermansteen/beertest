import './BeerCard.css'

function BeerCard ({ beerData, onClick }) {
  const beerInfo = beerData.beer
  const imageURL = 'https://product-cdn.systembolaget.se/productimages/' + beerInfo.productId + '/' + beerInfo.productId + '_400.png'
  return (
    <div className='beer-card' onClick={() => onClick(beerInfo)}>

      <div id='name'>
        <h2>{beerInfo.productNameThin}</h2>
        <p>{beerInfo.producerName}</p>
      </div>

      <div id='img'>
        <img src={imageURL} alt='Produktbild' />
      </div>

      <div id='info'>
        <p>{beerInfo.taste}</p>
      </div>

    </div>

  )
}

export default BeerCard
