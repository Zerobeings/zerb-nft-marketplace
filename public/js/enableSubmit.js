
var listingsIdField = document.getElementById("listingsId");
var offerFormField = document.getElementById("offerForm");
var offerListingIDField = document.getElementById("offerListingID");
var offerBuyerAddressField = document.getElementById("offerBuyerAddress");
var offerCurrencyContractAddressField = document.getElementById("offerCurrencyContractAddress");
var offerPriceperTokenField = document.getElementById("offerPriceperToken");
var collectionSearchField = document.getElementById("collectionSearch");
var inputTypeField = document.getElementById("inputType");
var NFTContractAddressField = document.getElementById("NFTContractAddress");
var NFTTokenIDField = document.getElementById("NFTTokenID");
var SalePriceField = document.getElementById("SalePrice");
var ReservePriceField = document.getElementById("ReservePrice");
var tokenFormRField = document.getElementById("tokenFormR");
var contractFormRField = document.getElementById("contractFormR");

if(contractFormRField){
  contractFormRField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(tokenFormRField){
  tokenFormRField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(ReservePriceField){
  ReservePriceField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(SalePriceField){
  SalePriceField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(NFTTokenIDField){
  NFTTokenIDField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(NFTContractAddressField){
  NFTContractAddressField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(inputTypeField){
  inputTypeField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(listingsIdField){
  listingsIdField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(offerFormField){
  offerFormField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(offerListingIDField){
  offerListingIDField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}


if(offerBuyerAddressField){
  offerBuyerAddressField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(offerCurrencyContractAddressField){
  offerCurrencyContractAddressField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}


if(offerPriceperTokenField){
  offerPriceperTokenField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}

if(collectionSearchField){
  collectionSearchField.addEventListener('keyup', async () => {
    let inputs = document.getElementsByClassName('required'); // Enter your class name for a required field, this should also be reflected within your form fields.
    let create = document.querySelector('input[type="submit"]');
    let isValid = true;
    
    for (var i = 0; i < inputs.length; i++){
      let changedInput = inputs[i];
          if (changedInput.value.trim() === "" || changedInput.value === null){
            isValid = false;
            break;
            }
      } 
      create.disabled = !isValid;
  });
}