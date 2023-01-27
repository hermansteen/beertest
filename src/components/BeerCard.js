import './BeerCard.css';
import imageExists from 'image-exists';

function BeerCard({ beerData, onClick }) {

    const beerInfo = beerData.beer;
    const beerSimilarity = beerData.similarity;
    let cardType = "";
    let imageURL = 'https://product-cdn.systembolaget.se/productimages/' + beerInfo.productId + '/' + beerInfo.productId + '_400.png';

    //Kollar om produktnamnet är tomt, samma som undernament eller samma som bryggeriet för att städa upp namnen lite
    if (beerInfo.productNameThin === undefined) {
        beerInfo.productNameThin = beerInfo.productNameBold;
    } else if (beerInfo.productNameThin === beerInfo.productNameBold || beerInfo.productNameThin === beerInfo.producerName) {
        beerInfo.productNameThin = '';
    } else if (beerInfo.productNameBold === beerInfo.producerName) {
        beerInfo.productNameBold = '';
    }

    //TODO: Jadu.... lös detta på något sätt. Funkar till och från!
    //Kollar om bilden finns på systembolagets CDN, annars ersätts den med en placeholder
    const waitForImg = async () => {
        await imageExists(imageURL, (image) => {
            if (image) {
            } else {
                imageURL = "https://sb-web-ecommerce-app.azureedge.net/_next/static/media/placeholder-beer-bottle.b611c272.png?q=75&w=1208";
            }
        })
    }
    
    if(beerInfo.categoryLevel2 === "Rött vin") {
        cardType = "redCard";
    } else if (beerInfo.categoryLevel2 === "Vitt vin") {
        cardType = "whiteCard"
        console.log("Vitt vin");
    } else if (beerInfo.categoryLevel1 === "Öl") {
        cardType = "beerCard";
        console.log("Öl");
    } else if (beerInfo.categoryLevel2 === "Rosévin") {
        cardType = "roseCard";
    } else {
        cardType = "defaultCard";
    }

    return (
        <div className={cardType} onClick={() => onClick(beerInfo)}>
            <div id="name">
                <h2>{beerInfo.productNameBold + " " + beerInfo.productNameThin}</h2>
                <p>{beerInfo.producerName}</p>
            </div>

            <div id="img">
                {waitForImg() && <img src={imageURL} alt="Bild på produkten" />}
            </div>

                <div id="volume">
                        <p>Volym: {beerInfo.volume + " ml"}<br/>                       
                        Pris på SB: {beerInfo.priceInclVat} kr<br/> 
                        {beerSimilarity > 29 && 
                        <p>Bra matchning!</p>}
                        {beerSimilarity <= 29 && beerSimilarity > 20 &&
                        <p>Ok matchning!</p>}
                        </p>
            </div>

            <div className="info">
                {beerInfo.isGlutenFree === "True" && <div id="tasteWGluten">
                    <p>{beerInfo.taste}<br /></p>

                </div>}
                {beerInfo.isGlutenFree === "False" && <div id="tasteNoGluten">
                    <p>{beerInfo.taste}</p>
                </div>}

                <div id="style">
                    {beerInfo.isGlutenFree === "True" &&

                        <p>{beerInfo.categoryLevel2 + " - " + beerInfo.categoryLevel3}<br />
                            Alk: {beerInfo.alcoholPercentage + "% "}
                        </p>
                    }

                    {beerInfo.isGlutenFree === "False" &&
                        <p>{beerInfo.categoryLevel2 + " - " + beerInfo.categoryLevel3}<br />
                            Alk: {beerInfo.alcoholPercentage + "% "}</p>
                    }
                </div>
            </div>
        </div>
    );

}

export default BeerCard;