const imageList = document.getElementById('imageList')
const uploadButton = document.getElementById('uploadButton')
const classifyLabel = document.getElementsByClassName('classifyLabel')

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

function classify(obj) {
  let targetImage = document.getElementById(obj.parentElement.children[0].id)

  classifier.classify(targetImage,(error, results) => {
        if(error) {
            console.error(error)
        } else {
            if(results.length > 0) {
                let result = results[0]
                obj.parentElement.children[2].innerHTML = `${result.label} Accuracy: ${Math.floor(result.confidence*100)}%`

            }
            console.log(results)
        }
    })
}

function modelReady() {
    for(let i = 0; 0 < classifyLabel.length; i++) {
      classify(classifyLabel[i])
    }
    console.log('Model has been initialized...')
}

// this initializes the MobileNet Machine Learning Model
function initializeModel() {
    // We are using a callback function modelReady
    // But you can also use Promises
    classifier = ml5.imageClassifier('MobileNet',modelReady)
}

initializeModel()
