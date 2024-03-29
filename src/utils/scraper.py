import csv
import re
import requests
import os

productHeaders = {"Host":"www.systembolaget.se", "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
"Accept":"*/*", "Accept-Language":"sv-SE,sv;q=0.8,en-US;q=0.5,en;q=0.3", "Accept-Encoding":"gzip, deflate, br",
"Referer":"https://www.systembolaget.se/produkt/ol/perfectly-squared-brewing-3739403/","DNT":"1",
"Connection":"keep-alive","Sec-fetch-Dest":"empty","Sec-fetch-Mode":"no-cors","Sec-fetch-Site":"same-origin",
"TE":"trailers", "baseURL":"https://api-systembolaget.azure-api.net/sb-api-ecommerce/v1", "Pragma":"no-cache", "Cache-Control":"no-cache",
"Cookie":"systembolaget.consent={%22state%22:{%22consentTypes%22:[%22useful%22%2C%22profiling%22%2C%22mandatory%22%2C%22statistical%22]}%2C%22version%22:0}; systembolaget.age={%22state%22:{%22verified%22:true}%2C%22version%22:0}; systembolaget.basket={%22state%22:{%22basket%22:null%2C%22addedBasketItem%22:{}%2C%22addedBasketItemsLength%22:null%2C%22errorOrderLine%22:null%2C%22confirmedNudgeItems%22:[]%2C%22isLargeOrder%22:false%2C%22goToCheckoutError%22:null%2C%22checkoutPostalCode%22:null}%2C%22version%22:0}; _ga=GA1.2.954457002.1665393871; _hjSessionUser_1313337=eyJpZCI6IjIyNzZkMTNjLWE4MTItNWI0YS04ODMxLWUwYzUwNzE4MjVkZiIsImNyZWF0ZWQiOjE2NjUzOTM4NzE1ODksImV4aXN0aW5nIjp0cnVlfQ==; systembolaget.tgm={%22state%22:{%22option%22:%22full_assortment%22%2C%22optionOnline%22:null%2C%22latestAgentIds%22:[]%2C%22latestStoreIds%22:[]%2C%22latestPostalCodes%22:[]}%2C%22version%22:0}; systembolaget.auth={%22state%22:{%22accessToken%22:null%2C%22refreshToken%22:null%2C%22expiresAt%22:null}%2C%22version%22:0}; systembolaget.in_store_user={%22state%22:{%22lastEmailAddress%22:null%2C%22isDirectLinkUsed%22:false}%2C%22version%22:0}; systembolaget.auth_b2c={%22state%22:{%22agentId%22:null%2C%22agentName%22:null%2C%22isAuthenticated%22:false}%2C%22version%22:0}; systembolaget.at_agent_order={%22state%22:{%22customer%22:null}%2C%22version%22:0}; systembolaget.in_store={%22state%22:{%22customer%22:null}%2C%22version%22:0}; vngage.id=4593904d-fca5-4b9c-bbb1-6f8fed820e8a+gjDkRP6sxXb2fYzJp15LnEuvqkucaeyeDlxKeCezt0=; vngage.vid=136732F2-B7E5-411A-868D-1F005D881300; vngage.lkvt=81E4006A-FC6A-4767-ACDD-16DB10B97710; psCurrentState=Ready"}

catalogHeaders = {"Host": "www.systembolaget.se",
"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
"Accept-Language":"sv-SE,sv;q=0.8,en-US;q=0.5,en;q=0.3",
"Accept-Encoding":"gzip, deflate, br",
"Referer":"https://www.google.com/",
"DNT":"1",
"Connection":"keep-alive",
"Cookie":"systembolaget.consent={%22state%22:{%22consentTypes%22:[%22useful%22%2C%22profiling%22%2C%22mandatory%22%2C%22statistical%22]}%2C%22version%22:0}; systembolaget.age={%22state%22:{%22verified%22:true}%2C%22version%22:0}; systembolaget.basket={%22state%22:{%22basket%22:null%2C%22addedBasketItem%22:{}%2C%22addedBasketItemsLength%22:null%2C%22errorOrderLine%22:null%2C%22confirmedNudgeItems%22:[]%2C%22isLargeOrder%22:false%2C%22goToCheckoutError%22:null%2C%22checkoutPostalCode%22:null}%2C%22version%22:0}; _ga=GA1.2.954457002.1665393871; _hjSessionUser_1313337=eyJpZCI6IjIyNzZkMTNjLWE4MTItNWI0YS04ODMxLWUwYzUwNzE4MjVkZiIsImNyZWF0ZWQiOjE2NjUzOTM4NzE1ODksImV4aXN0aW5nIjp0cnVlfQ==; systembolaget.tgm={%22state%22:{%22option%22:%22full_assortment%22%2C%22optionOnline%22:null%2C%22latestAgentIds%22:[]%2C%22latestStoreIds%22:[]%2C%22latestPostalCodes%22:[]}%2C%22version%22:0}; systembolaget.auth={%22state%22:{%22accessToken%22:null%2C%22refreshToken%22:null%2C%22expiresAt%22:null}%2C%22version%22:0}; systembolaget.in_store_user={%22state%22:{%22lastEmailAddress%22:null%2C%22isDirectLinkUsed%22:false}%2C%22version%22:0}; systembolaget.auth_b2c={%22state%22:{%22agentId%22:null%2C%22agentName%22:null%2C%22isAuthenticated%22:false}%2C%22version%22:0}; systembolaget.at_agent_order={%22state%22:{%22customer%22:null}%2C%22version%22:0}; systembolaget.in_store={%22state%22:{%22customer%22:null}%2C%22version%22:0}; vngage.vid=7FFC37DF-977D-4765-A284-0E9CB0F8F8E5; vngage.lkvt=07BBE450-B316-4BF7-A82D-6541BE26DA4D; psCurrentState=Ready",
"Upgrade-Insecure-Requests":"1",
"Sec-Fetch-Dest":"document",
"Sec-Fetch-Mode":"navigate",
"Sec-Fetch-Site":"cross-site",
"Pragma":"no-cache",
"Cache-Control":"no-cache"}

#read products.csv and save it to a list
with open('wine.csv', 'r') as file:
    reader = csv.reader(file)
    existingProducts = list(reader)
#remove the first row of the list
existingProducts.pop(0)
#save the product ids to a list
savedProductIds = []

for product in existingProducts:
    savedProductIds.append(product[0])
    

wineCatalog = requests.get("https://www.systembolaget.se/sitemap-produkter-vin.xml", headers=catalogHeaders)

#add beers to catalog
beerCatalog = requests.get("https://www.systembolaget.se/sitemap-produkter-ol.xml", headers=catalogHeaders)

#extract the product links from the xml
catalogLinks = re.findall(r'<loc>(.*?)</loc>', wineCatalog.text)

#add beers to catalogLinks
catalogLinks += re.findall(r'<loc>(.*?)</loc>', beerCatalog.text)

#print link 50
print(catalogLinks[0])
#keep only first 100 values of the list
#catalogLinks = catalogLinks[:100]
first = True
linksHandled = 0
#write all column names to the csv file
#loop through all the links and extract the product id, save it to a csv file
for link in catalogLinks:
    linksHandled += 1
    print("Percentage done: " + str(linksHandled/len(catalogLinks)*100) + "%")
    productId = re.findall(r'-(\d+)', link)
    productHeaders['Referer'] = link
    if(productId[0] in savedProductIds):
        continue
    product = requests.get("https://www.systembolaget.se/api/gateway/product/productnumber/" + productId[0] + "/", headers=productHeaders)
    if(product.status_code != 200):
        continue
    if(first):
        first = False
        with open('testing.csv', 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=product.json().keys())
            print(product.json().keys())
            writer.writeheader()
    #write the product to the csv file if taste, aroma, categoryLevel1, categoryLevel2, categoryLevel3, categoryLevel4, usage are not null
    if(product.json()['taste'] != None and product.json()['aroma'] != None and product.json()['categoryLevel1'] != None and product.json()['categoryLevel2'] != None and product.json()['categoryLevel3'] != None and product.json()['usage'] != None and product.json()['productNameBold'] != None and product.json()['productNameThin'] != None):
        with open('testing.csv', 'a', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=product.json().keys())
            writer.writerow(product.json())







#print(response.headers)
#print(response.json())
#save respone to test.json