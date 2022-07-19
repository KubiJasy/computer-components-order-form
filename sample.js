    // add event listener for selected product
       
              // add event listener for remove button
              try {
                for(let i = 0; i < document.querySelector('.cart').children.length; i++){
                  let removeButton = document.querySelector('.cart').children[i].querySelector('.remove')
                  let productContaniner = removeButton.parentElement.parentElement.parentElement
                  try {
                    removeButton.addEventListener('click', () => {
                      let idToRemove = productContaniner.getAttribute('id')
                      let delContainer = document.getElementById(idToRemove)
                      data[index][componentType][i]['in-cart'] = false
                      delContainer.remove()
                    })
                  } catch (e){
                    continue
                  }
                }
            } catch (e) {
              continue
            }

           
          }
      
            
          

          })    
        })
    })

    
  })