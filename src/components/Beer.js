
const Beer = ({ beer, similarity, findSimilar }) => {
  return (
    <li>
      <h3>{beer.productNameBold}</h3>
      <p>{beer.productNameThin}</p>
      <p>{beer.taste}</p>
      <p>{beer.aroma}</p>
      <p>Similarity: {similarity}</p>
      <button onClick={() => findSimilar(beer)}>Find similar</button>
    </li>
  )
}

export default Beer
