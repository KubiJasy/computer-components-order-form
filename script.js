"use strict";
import data from '/data.json' assert {type: 'json'};

// event listener to check if the dom content has loaed
document.addEventListener("DOMContentLoaded", function() {
  let totalPrice = 0.00
  
  // generate and populate invoice id
  let invoiceIDInput = document.getElementById('invoice-no')
  invoiceIDInput.style.border = '2px solid lightgreen'
  let invoiceID =  'BC' + Math.floor(100000 + Math.random() * 900000);
  invoiceIDInput.setAttribute('value', invoiceID);

  //populate date field
  (function () {
    const date = new Date().toISOString().substring(0, 10),
    dateField = document.querySelector('#date');
    dateField.style.border = '2px solid lightgreen'
    dateField.value = date;
  })();

  //populating the part type or category select box 
  let selectBox = document.querySelector('select#category');
  let count = 1;
  for (let category in data) {
    let option = document.createElement('option');
    option.innerText = Object.keys(data[category]);
    option.setAttribute('value', `category${count}`);
    selectBox.appendChild(option);
    count += 1;
  }

  // populate country select box
  let countrySelectBox = document.querySelector('#country')
  let defaultValue = document.createElement('option')
  defaultValue.innerText = '--'
  defaultValue.setAttribute('value', 'null')
  countrySelectBox.appendChild(defaultValue)

  
  fetch('https://restcountries.com/v3.1/all').then(response => {return response.json()}).then(countries =>
   { let countryNames = []
    countries.forEach(country => {
      countryNames.push(country['name']['common'])
    })
    countryNames.sort()
    countryNames.forEach(countryName => {
      let option3 = document.createElement('option')
      option3.innerText = countryName
      option3.setAttribute('value', countryName)
      countrySelectBox.appendChild(option3)
    })
  })

  // auto format payment details field

  
  // auto format credit card number
    document.getElementById('card-number').addEventListener('input', function (e) {
      var x = e.target.value.replace(/\D/g, '').match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '')
  });

  // auto format cvc
    document.getElementById('security-code').addEventListener('input', (e) => {
      let y = e.target.value.replace(/\D/g, '').match(/(\d{0,3})/)
      e.target.value = y[1]
    })

  // auto format expiry date
    document.getElementById('expiry-date').addEventListener('input', (e) => {
      let z = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})/)
      e.target.value = !z[2] ? z[1] : z[1] + '/' + z[2]
    })

  //add event listner for selected category to populate products select box
  let selectBoxOption = document.querySelectorAll('#category option')
  let partSelectBox = document.querySelector('select#component-name')
  selectBoxOption.forEach((elem) => {
        elem.addEventListener('click', function componentPart(e) {
        partSelectBox.innerHTML = '';
        let count = 1
        for (let index = 0; index < data.length; index++) {
          let componentType = Object.keys(data[index])
          if (componentType == elem.innerText) {
            let list = data[index][componentType];
            for (let i = 0; i < list.length; i++) {
              let option1 = document.createElement('option')
              option1.innerText = list[i]['product_name']
              option1.setAttribute('value', `item${count}`);
              partSelectBox.appendChild(option1);
              count += 1
              };
          }
        }
      })
    })
  
  // add event listeners to products to populate the cart (I learnt a new concept, event delegation, I was struggling before)
  let addItemsContainer = document.querySelector('#component-name')
  addItemsContainer.addEventListener('click', (e) => {
    if (e.path[1].getAttribute('id') == 'component-name') {
      let partSelectBoxOption = document.querySelectorAll('#component-name option')
      let cart = document.querySelector('.cart')
      let uniqueID = 1
      partSelectBoxOption.forEach((elem1) => {
        elem1.addEventListener('click', function addProduct() {
          for (let index = 0; index < data.length; index++) {
            let componentType = Object.keys(data[index])              
            for (let i = 0; i < data[index][componentType].length; i++) {
              if (data[index][componentType][i]['product_name'] == elem1.innerText && data[index][componentType][i]['in-cart'] == false) {
                let cartItem = document.createElement('div')
                cartItem.classList.add('cart-item')
                cartItem.setAttribute('id', uniqueID)
                cartItem.innerHTML = `<img class="cart-img" src="assets/transistor.jfif" alt="AMD">
                <div class="part-details">
                    <span class="part-name">AMD Ryzen - CPU</span>
                    <p>Unit Price: GH&#8373;<span class="unit-price">32.00</span></p>
                    <div class="qty-remove-flex">
                        <div class="qty">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" style="enable-background:new 0 0 30 30;" version="1.1" viewBox="0 0 30 30" xml:space="preserve" width="30px" height="30px"><path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M21,16H9c-0.552,0-1-0.447-1-1  s0.448-1,1-1h12c0.552,0,1,0.447,1,1S21.552,16,21,16z" style=" stroke:none;fill-rule:nonzero;fill:rgb(37.64706%,93.725491%,100%);fill-opacity:1;"/></svg>
                            <span class="total-qty">1</span>
                            <img src="assets/plus-icon.svg" alt="increment">
                        </div>
                        <span class="remove">Remove</span>
                    </div>
                </div>`
                let cartImage = cartItem.querySelector('.cart-img')
                cartImage.setAttribute('src', data[index][componentType][i]['image-src'])
                cartImage.setAttribute('alt', data[index][componentType][i]['product_name'])
                let partName = cartItem.querySelector('.part-name')
                partName.innerText = data[index][componentType][i]['product_name']
                let unitPrice = cartItem.querySelector('.unit-price')
                let regex = /\D\D.*/;
                unitPrice.innerText = data[index][componentType][i]['price'].slice(1,8).replace(regex, '')
                cart.appendChild(cartItem)
                data[index][componentType][i]['in-cart'] = true
                let totalQty = parseInt(cartItem.querySelector('.total-qty').innerText)
                let tempTotalPrice = document.querySelector('.total-price')
                totalPrice = totalPrice + (parseFloat(data[index][componentType][i]['price'].slice(1,8).replace(regex, '').trim())) * totalQty;
                let rounded = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
                totalPrice = rounded
                tempTotalPrice.innerText = totalPrice
                uniqueID += 1;
              }
            }
          }
      })
    })
  }
}); 

// add event listners to remove elements from cart
let removeItemsContainer = document.querySelector('.cart')
removeItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList[0] == 'remove') {
    let removeButton = e.target
    let productContaniner = removeButton.parentElement.parentElement.parentElement
    let productName = productContaniner.querySelector('.part-name').innerText
    let idToRemove = productContaniner.getAttribute('id')
    let delContainer = document.getElementById(idToRemove)
    for (let index = 0; index < data.length; index++) {
      let componentType = Object.keys(data[index]) 
      for (let i = 0; i < data[index][componentType].length; i++) {
        if (data[index][componentType][i]['product_name'] == productName) {
          data[index][componentType][i]['in-cart'] = false
        }
      }
      }
      let totalQty = parseInt(productContaniner.querySelector('.total-qty').innerText)
      let tempTotalPrice = document.querySelector('.total-price')
      totalPrice = totalPrice - (parseFloat(e.target.parentElement.parentElement.querySelector('.unit-price').innerText.trim())) * totalQty;
      let rounded = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
      totalPrice = rounded
      tempTotalPrice.innerText = totalPrice
      delContainer.remove()
    }
  })


// add event listeners to toggle quantities
let toggleQtyContainer = document.querySelector('.cart')
toggleQtyContainer.addEventListener('click', (e) => {
  if (e.path[1].getAttribute('id') == 'Layer_1') {
    let unitPrice = e.path[1].parentElement.querySelector('.total-qty').innerText
    let current = parseInt(unitPrice.trim())
    if ((current - 1) !== 0) {
      current = current - 1
      e.path[1].parentElement.querySelector('.total-qty').innerText = current
      let tempTotalPrice = document.querySelector('.total-price')
      totalPrice = totalPrice - (parseFloat(e.path[1].parentElement.parentElement.parentElement.querySelector('.unit-price').innerText.trim()));
      let rounded = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
      totalPrice = rounded
      tempTotalPrice.innerText = totalPrice
    }
  } else if (e.path[1].classList[0] == 'qty') {
    let unitPrice = e.path[1].querySelector('.total-qty').innerText
    let current = parseInt(unitPrice.trim())
    current = current + 1
    e.path[1].parentElement.querySelector('.total-qty').innerText = current
    let tempTotalPrice = document.querySelector('.total-price')
    totalPrice = totalPrice + (parseFloat(e.path[1].parentElement.parentElement.querySelector('.unit-price').innerText.trim()));
    let rounded = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
    totalPrice = rounded
    tempTotalPrice.innerText = totalPrice
  }
})
})

// FORM VALIDATION

let countrySelectBox = document.getElementById('country')
let inputs = document.querySelectorAll('input')

let labelCountrySelectBox = countrySelectBox.parentElement.querySelector('label')
labelCountrySelectBox.innerHTML = `<span class="required">* </span>${labelCountrySelectBox.innerText}`

inputs.forEach((input) => {
  if (input.required){
    let labelInput = input.parentElement.querySelector('label');
    labelInput.innerHTML = `<span class="required">* </span>${labelInput.innerText}`
  }
})

  

