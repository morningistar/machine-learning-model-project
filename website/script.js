let video, classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/zCBrWiakB/';
let label = "waiting...";
let uploadedImg;
let useWebcam = true;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 520).parent(document.body);

  video = createCapture(VIDEO);
  video.size(640, 520);
  video.hide();

  // Hook up button clicks
  document.getElementById("webcamBtn").addEventListener("click", () => {
    useWebcam = true;
    classifyVideo();
  });

  document.getElementById("uploadBtn").addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function(e) {
        uploadedImg = loadImage(e.target.result, () => {
          useWebcam = false;
          classifyImage();
        });
      };
      reader.readAsDataURL(file);
    }
  });

  classifyVideo(); // default start webcam
}

function classifyVideo() {
  if (useWebcam) classifier.classify(video, gotResult);
}

function classifyImage() {
  if (uploadedImg) classifier.classify(uploadedImg, gotResult);
}

function draw() {
  background(0);
  if (useWebcam) {
    image(video, 0, 0, width, height);
  } else if (uploadedImg) {
    image(uploadedImg, 0, 0, width, height);
  }

  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(label, width / 2, height - 20);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = "This looks like: " + results[0].label;
  if (useWebcam) classifyVideo();
}
