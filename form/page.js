function validateInput() {
  var inputText = document.getElementById("phoneNumber").value;
  var regex = /^0[5-7][0-9]{8}$/;
  if (!regex.test(inputText)) {
    document.getElementById("phoneNumber").value = "";
  }
}


//

let communeData = [];

const filePath = 'communeData.json';

fetch(filePath)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    communeData = data;
    console.log('Data loaded successfully:', communeData);
    document.getElementById('wilayas').addEventListener('change', updateCommunes);
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });

function updateCommunes() {
  const wilayaSelect = document.getElementById('wilayas');
  const communeSelect = document.getElementById('commune');
  const selectedWilaya = wilayaSelect.value;

  communeSelect.innerHTML = '<option value="" hidden>بلدية</option>';

  const filteredCommunes = communeData.filter(commune => commune.wilaya_id === selectedWilaya);

  if (filteredCommunes.length > 0) {
    communeSelect.setAttribute('required', 'required');
    communeSelect.classList.remove('disabled');
    communeSelect.removeAttribute('disabled');
  } else {
    communeSelect.removeAttribute('required');
    communeSelect.classList.add('disabled');
    communeSelect.setAttribute('disabled', 'disabled');
  }

  filteredCommunes.forEach(commune => {
    const option = document.createElement('option');
    option.value = commune.ar_name;
    option.textContent = commune.ar_name;
    communeSelect.appendChild(option);
  });
}

  document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('deliveryForm').addEventListener('submit', function(event) {
          event.preventDefault();

          var form = this;
          var formData = new FormData(form);

          var xhr = new XMLHttpRequest();
          xhr.open('POST', form.action, true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.onreadystatechange = function() {
              if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                  window.location.href = 'Congratulation.php'; 
              }
          };
          xhr.send(new URLSearchParams(formData)); 
          document.getElementById('valider').disabled = true;
          document.getElementById('valider').style.opacity = '0.2';
      });
  });

//

document.addEventListener('DOMContentLoaded', () => {
  const wilayaSelect = document.getElementById('wilayas');
  const quantitySelect = document.getElementById('Quantite');
  const deliveryTypeRadios = document.getElementsByName('deliveryType');
  const livraisonPrice = document.getElementById('livraisonPrice');
  const totalAmount = document.getElementById('totalAmount');
  const productPriceInput = document.getElementById('productPriceInput');
  const livraisonPriceInput = document.getElementById('livraisonPriceInput');
  const totalHiddenInput = document.getElementById('TotalInput');
  const submitButton = document.getElementById('valider');

  wilayaSelect.addEventListener('change', updatePrice);
  quantitySelect.addEventListener('change', updatePrice);
  deliveryTypeRadios.forEach(radio => radio.addEventListener('change', updatePrice));

  function updatePrice() {
      const wilayaCode = wilayaSelect.value;
      const quantity = quantitySelect.value;
      const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
      const productPrice = parseFloat(productPriceInput.value);

      if (wilayaCode && quantity && deliveryType) {
          const jsonFile = deliveryType === 'desk' ? 'Desk.json' : 'Domicile.json';

          fetch(jsonFile)
              .then(response => response.json())
              .then(data => {
                  let deliveryCost = null;
                  for (const [cost, wilayas] of Object.entries(data)) {
                      if (wilayas.includes(wilayaCode)) {
                          deliveryCost = cost;
                          break;
                      }
                  }

                  const totalProductPrice = productPrice * quantity;
                  const totalCost = deliveryCost ? (totalProductPrice + parseInt(deliveryCost)) : totalProductPrice;

                  livraisonPrice.textContent = deliveryCost ? `${deliveryCost} DA` : 'Price not available';
                  totalAmount.textContent = `${totalCost} DA`;
                  livraisonPriceInput.value = deliveryCost ? deliveryCost : '';
                  totalHiddenInput.value = totalCost;
              })
              .catch(error => {
                  console.error('Error fetching JSON:', error);
                  alert('An error occurred while fetching the delivery price. Please try again.');
              });
      }
  }

  submitButton.addEventListener('click', function(event) {
      const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
      if (deliveryType === 'domicile' && livraisonPriceInput.value === '') {
          event.preventDefault(); 
          alert('Please select a valid delivery option.'); 
      }
  });
});