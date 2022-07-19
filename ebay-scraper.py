import json
import pprint as p
from unicodedata import category
from requests_html import HTMLSession

session = HTMLSession()
url = 'https://www.ebay.com/b/Computer-Parts-Components/175673/bn_1643095'
response = session.get(url)

content = response.html

def get_categories(content):
    dict1 = {} 
    category_links = content.find('#s0-28-9-0-1\[0\]-0-1\[0\]-0-12-container ul a.b-guidancecard__link')
    for link in category_links:
        dict1[link.text] = link.attrs['href']
    return dict1

parts_data = []

categories = get_categories(content)
for k,v in categories.items():
    temp_dict = {}
    temp_list = []
    response1 = session.get(v)
    content1 = response1.html
    sel = '#s0-28_2-9-0-1\[0\]-0-0 ul.b-list__items_nofooter.srp-results.srp-grid li '
    products = content1.find(sel)
    count = 0
    for product in products:
        
        temp_dict1 = {}
        if 'data-src' in content1.find(sel + 'div.s-item__image-helper .s-item__image-img')[count].attrs:
            image = content1.find(sel + 'div.s-item__image-helper .s-item__image-img')[count].attrs['data-src']
        else:
            image = content1.find(sel + 'div.s-item__image-helper .s-item__image-img')[count].attrs['src']
        product_name = content1.find(sel + 'div.s-item__info a h3.s-item__title')[count].text
        price = content1.find(sel + 'div.s-item__details span.s-item__price')[count].text

        temp_dict1['image-src'] = image
        temp_dict1['product_name'] = product_name
        temp_dict1['price'] = price
        temp_dict1['in-cart'] = False
        temp_list.append(temp_dict1)
        count += 1
    temp_dict[k] = temp_list
    parts_data.append(temp_dict)    

with open('data.json', 'w') as file:
    json.dump(parts_data, file)