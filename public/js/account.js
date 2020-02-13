const username = document.getElementById('userName')
const accountImageList = document.getElementById('accountImageList')
const classifyLabel = document.getElementsByClassName('classifyLabel')
const footer = document.getElementById('footer')

function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  if(tabName == 'AccountDetails') {
    footer.style.position = 'absolute'
  } else {
    footer.style.position = 'relative'
  }
  document.getElementById(tabName).style.display = "flex";
}

fetch('http://localhost:3000' + window.location.pathname + '/accountImages')
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
    accountImageList.innerHTML += images[i]
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

username.style.color = 'grey'

initializeModel()
