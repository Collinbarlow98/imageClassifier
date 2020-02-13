const input = document.getElementById('inputImage')
const homeLink = document.getElementById('homeLink')
const body = document.getElementById('body')
const footer = document.getElementById('footer')

let chosenImage;
let chosenImageLabel;

const preview = document.querySelector('.preview');

input.style.opacity = 0;

input.addEventListener('change', updateImageDisplay);

function updateImageDisplay() {
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  const curFiles = input.files;
  if(curFiles.length === 0) {
    const para = document.createElement('p');
    para.textContent = 'No files currently selected for upload';
    preview.appendChild(para);
  } else {
    footer.style.position = 'relative'
    const list = document.createElement('ol');
    preview.appendChild(list);

    for(const file of curFiles) {
      const listItem = document.createElement('li');
      const para = document.createElement('p');
      para.setAttribute('id','chosenImageLabel')
      if(validFileType(file)) {
        let reader = new FileReader()
        const image = document.createElement('img');
        image.setAttribute('id','chosenImage')
        reader.onload = function (e) {
          image.setAttribute('src', e.target.result)
        }
        reader.readAsDataURL(file)

        listItem.appendChild(image);
        listItem.appendChild(para);
      } else {
        para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
        listItem.appendChild(para);
      }
      list.appendChild(listItem);
      start()
    }
  }
}

const fileTypes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png'
];

function validFileType(file) {
  return fileTypes.includes(file.type);
}

function predict() {
  chosenImage = document.getElementById('chosenImage')
  chosenImageLabel = document.getElementById('chosenImageLabel')
  if(chosenImage != undefined) {
  classifier.classify(chosenImage,(error, results) => {
    if(error) {
      console.error(error)
    } else {
      if(results.length > 0) {
        let result = results[0]
        if(`Prediction: ${result.label} Accuracy: ${Math.floor(result.confidence * 100)}%` != chosenImageLabel.innerHTML) {
          chosenImageLabel.innerHTML = `Prediction: ${result.label} Accuracy: ${Math.floor(result.confidence * 100)}%`
          predict()
        } else {
          clearInterval(myInt)
        }
      }
    }
  })
}
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

homeLink.style.color = 'grey'

footer.style.position = 'absolute'

initializeModel()

var myInt;

function start() {
  myInt = setInterval(predict, 1000)
}
