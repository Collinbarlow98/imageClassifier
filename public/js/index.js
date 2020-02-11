
const chosenImage = document.getElementById('chosenImage')
const chosenImageLabel = document.getElementById('chosenImageLabel')
const inputImage = document.getElementById('inputImage')

function showChosenImage(input) {
  var reader = new FileReader()
  reader.onload = function (e) {
    chosenImage.setAttribute('src', e.target.result)
  }
  reader.readAsDataURL(input.files[0])
  classify()
}

function classify() {
  classifier.classify(chosenImage,(error, results) => {
    if(error) {
      console.error(error)
    } else {
      if(results.length > 0) {
        let result = results[0]
        if(`${result.label} - ${result.confidence}` != chosenImageLabel.innerHTML) {
          chosenImageLabel.innerHTML = `${result.label} Accuracy: ${result.confidence}`
          classify()
        } else {
          console.log(results)
        }
      }
    }
  })
}

function modelReady() {
  inputImage.disable = false
    console.log('Model has been initialized...')
}

// this initializes the MobileNet Machine Learning Model
function initializeModel() {
    // We are using a callback function modelReady
    // But you can also use Promises
    classifier = ml5.imageClassifier('MobileNet',modelReady)
}

initializeModel()
