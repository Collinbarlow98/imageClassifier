const imageList = document.getElementById('imageList')
const uploadButton = document.getElementById('uploadButton')
const classifyLabel = document.getElementsByClassName('classifyLabel')
const savedImagesLink = document.getElementById('savedImagesLink')

fetch('http://localhost:3000/images')
.then(res => {
  return res.json()
})
.then(json => {
  let images = json.map(image => {
    return (
      `<li><img id=${image.imagePath} src=${image.imagePath} alt='noimage'/><br/><label class='classifyLabel'></label></li>`
    )
  })
  for(let i = 0; i < images.length; i++) {
    imageList.innerHTML += images[i]
  }
})

function predict() {
  for(let i = 0; i < classifyLabel.length; i++){
    let obj = classifyLabel[i]

    let targetImage = document.getElementById(obj.parentElement.children[0].id)

    classifier.classify(targetImage,(error, results) => {
      if(error) {
        console.error(error)
      } else {
        if(results.length > 0) {
          let result = results[0]
          obj.parentElement.children[2].innerHTML = `Prediction: ${result.label} <br/> Accuracy: ${Math.floor(result.confidence*100)}%`
        }
      }
    })
  }
}

function modelReady() {
  predict()
  console.log('Model has been initialized...')
}

// this initializes the MobileNet Machine Learning Model
function initializeModel() {
  // We are using a callback function modelReady
  // But you can also use Promises
  classifier = ml5.imageClassifier('MobileNet',modelReady)
}

savedImagesLink.style.color = 'grey'

initializeModel()
