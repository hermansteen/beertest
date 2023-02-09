# The beer search engine: BeerMe!

This project was created using React and Python for the course TNM108 at LiU.

## Pipeline
The pipeline for creating this app is divided in 4 steps: Database, Preprocessing, Matching and Display.

### The database
We knew that we wanted to create a site that given previous products that a person likes, can recommend new ones for them to try. We went searching for a database which contained detailed information about the style, taste, color, aroma and other descriptors for a beer. We knew Systembolaget had a public API for accessing their gathered information but that had apparently shut down recently. 

We then searched around for other free databases but found none that were quite to our liking. The decision was then made to instead scrape Systembolagets website for their database and make our own version of that database which we would store locally on our computers.

#### Data mining
While searching for a snapshop of the previous systembolaget API, Herman found a sitemap for all of [systembolagets beer products](https://www.systembolaget.se/sitemap-produkter-ol.xml). With a few hours of coding and some peeking into the workings of how their site fetches product information, a scraper was ready. [This scraper](/src/utils/scraper.py) when run would fetch all products from the sitemap for beer and all the product from the [sitemap for wine](https://www.systembolaget.se/sitemap-produkter-vin.xml) and save them in a [csv file](/src/utils/testing.csv).

The basic structure of of the scraper is as follows:
```python
def scrape():
    # Fetch the sitemap for beer and wine
    sitemap = fetch_sitemap()
    # Extract all the links from the sitemap
    links = fetch_links(sitemap)
    # Fetch all products from the sitemap
    products = fetch_product_info(links)
    # Save the products to a csv file
    save_to_csv(products)
```

The scraper was then run on a server and the csv file was downloaded to the local machine. The csv file was then used to create a [json file](/src/utils/products.json) which was used as the database for the app.

#### Preprocessing
To prepare the data for our model we first had to discard all the entires of the database which contained null values for the features we intended to use for our model. This was done directly in the scaper to reduce unneccessary calculations and increase performance. Then we have each object a unique id with the js library uuid to be used later on. Stopwords were provided to the library which did the matching. 

### Matching

#### TF-IDF
TF-IDF uses the term frequency and inverse document frequency to find the most important words in a document. The term frequency is the number of times a word appears in a document, and the inverse document frequency is the number of documents in the corpus divided by the number of documents that contain the word. The TF-IDF is then the product of these two values. The TF-IDF is used to find the most important words in a document, and the most important documents in a corpus.

In our implementation the documents are the features for each product combined into one string, and the corpus is formed by all of these documents together.

#### Cosine similarity
Cosine similarity is a measure of similarity between two vectors. It is calculated by dividing the dot product of the two vectors by the product of the magnitude of the two vectors. The cosine similarity is a value between 0 and 1, where 0 means that the two vectors are completely different and 1 means that the two vectors are identical.


#### Implementation
To match products to each other, we first combined all their features into one string. We concatenated the taste description with the category and aroma description and so on. These strings are for TF-IDF our documents, and all of them together form the corpus. So to find a similar beer, we provide the concatenated string (document) for that beer to the corpus and ask it to find a similar beer (document). This was done in the tiny-tfidf js library. 

To search for a beer which you want to find similars to, you simply type the name in and the name only is then used as a document for the model and finds the beers which match that name. A problem arises here as only complete words work for searching, and they have to be spelled correctly for the searching to work. Which does not really give a good user experience as it allows for nearly no errors.

### Display
The corpus for searching is created when the site is loaded, to search for a beer you simply start typing in the search field and matches are displayed as fast as they are found. The seaching here is done in the exact same way as when finding similar beers, only the search query is what you write in the field, instead of all features of a beer combined together.

At first our thought was to split the beer and wine searching into two different searches that you could swich between with a toggle button. But when adapting our app for this we found several hindrances and played with the idea of just throwing beer and wine into the same corpus and seeing if they kept themselves separate through their unique characteristics in taste and through the categories provided by Systembolaget. We implemented this and it works, search for a wine, click to find similar and none of them will be beers. Search for a beer, click to find similar and none of them will be beers. Sometimes the simplest solution is the best solution.

The results from the model are displayed in a grid with the cards containing the name, producer, picture of the product and a description of the product. The description is a short description of the product provided by Systembolaget. When hovering the cards the price and volume of the product. The cards are clickable and when clicked they will show products that are similiar. The most similiar product is shown first and the least similiar last with a text showing how similiar it is.

### Results
We are happy with the result. It works as intended and we are happy with the performance. The only thing we would have liked to have done is to have a better search function. We would have liked to have a search function that could handle misspelled words and partial words. We tried to implement this but could not get it to work in time. We also would have liked to have a better way of displaying the results. 

In this implementation we used the producers name as a feature for the model to be able to search for the producer. The downside of this is that this brings down the similarity score for products that are similar in taste but not from the same producer. 
