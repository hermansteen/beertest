# The beer search engine: BeerMe!

This project was created using React and Python for the course TNM108 at LiU.

## Pipeline
The pipeline for creating this app is divided in 4 steps: Database, Preprocessing, Matching and Display.

### The database
We knew that we wanted to create a site that given previous products that a person likes, can recommend new ones for them to try. We went searching for a database which contained detailed information about the style, taste, color, aroma and other descriptors for a beer. We knew Systembolaget had a public API for accessing their gathered information but that had apparently shut down recently. 

We then searched around for other free databases but found none that were quite to our liking. While searching for a snapshop of the previous systembolaget API, Herman found a sitemap for all of [systembolagets beer products](https://www.systembolaget.se/sitemap-produkter-ol.xml). With a few hours of coding and some peeking into the workings of how their site fetches product information, a scraper was ready. [This scraper](/src/utils/scraper.py) when run would fetch all products from the sitemap for beer and all the product from the [sitemap for wine](https://www.systembolaget.se/sitemap-produkter-vin.xml) and save them in a [csv file](/src/utils/testing.csv).

### Preprocessing
To prepare the data for our model we first had to discard all the entires of the database which contained null values for the features we intended to use for our model. This was done directly in the scaper to reduce unneccessary calculations and increase performance. Then we have each object a unique id with the js library uuid to be used later on. And stopwords were provided to the library which did the matching. 

### Matching
To match products to each other, we first combined all their features into one string. We concatenated the taste description with the category and aroma description and so on. These strings are for our TF-IDF our documents, and all of them together form the corpus. So to find a similar beer, we provide the concatenated string (document) for that beer to the corpus and ask it to find a similar beer (document). This was done in the tiny-tfidf js library. 

To search for a beer which you want to find similars to, you simply type the name in and the name only is then used as a document for the model and finds the beers which match that name. A problem arises here as only complete words work for searching, and they have to be spelled correctly for the searching to work. Which does not reall give a good user experience as it allows for nearly no errors.

### Display
The corpus for searching is created when the site is loaded, to search for a beer you simply start typing in the search field and matches are displayed as fast as they are found. The seaching here is done in the exact same way as when finding similar beers, only the search query is what you write in the field, instead of all features of a beer combined together.

At first our thought was to split the beer and wine searching into two different searches that you could swich between with a toggle button. But when adapting our app for this we found several hindrances and played with the idea of just throwing beer and wine into the same corpus and seeing if they kept themselves separate through their unique characteristics in taste and through the categories provided by Systembolaget. We implemented this and it works, search for a wine, click to find similar and none of them will be beers. Search for a beer, click to find similar and none of them will be beers. Sometimes the simplest solution is the best solution.