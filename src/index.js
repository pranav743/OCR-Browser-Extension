const imageContainer = document.getElementById('image-container');
const processButton = document.getElementById('process-button');
const outputDiv = document.getElementById('output');

const Tesseract = require('tesseract.js');
// const fs = require('fs');

// Listen for the "paste" event on the document
document.addEventListener('paste', handlePasteEvent);

// Handle the "paste" event
function handlePasteEvent(event) {
    
  const items = event.clipboardData.items;
  if (items) {
    // Find the latest image in the clipboard items
    let latestImage = null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        latestImage = item;
      }
    }

    if (latestImage) {
      // Retrieve the image data from the latest image item
      const file = latestImage.getAsFile();

      // Process the image file
      processImageFile(file);
    }
  }
}

// Process the image file
function processImageFile(file) {
  const reader = new FileReader();

  // Handle the FileReader load event
  reader.onload = function(event) {
    // Create an <img> element to display the image
    const imgElement = document.getElementById('img');
    imgElement.src = event.target.result;

    // Append the image element to the image container
    // imageContainer.appendChild(imgElement);

    // Enable the process button
    processButton.disabled = false;
    processButton.addEventListener('click', () => {
      // Perform OCR on the image
      performOCR(imgElement);
    });
  };

  // Read the image file as a data URL
  reader.readAsDataURL(file);
}

// Perform OCR on the image using Tesseract.js
function performOCR(imageElement) {
  document.getElementById('output-div').style.display = "block";
  outputDiv.style.display = "block";
  outputDiv.textContent = "Please Wait...";
  Tesseract.recognize(imageElement)
    .then((result) => {
      const text = result.data.text;
      // document.getElementById('output-div').style.display = "block";
      // outputDiv.style.display = "block";

      if (text==""){
        outputDiv.textContent = "Cannot find text o Extract.";
      } else{
        outputDiv.textContent = text;
      }
    })
    .catch((error) => {
      outputDiv.textContent = `Error : ${error}`;
      console.error('Error performing OCR:', error);
    });
}
