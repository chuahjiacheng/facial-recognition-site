const video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error('Error accessing webcam:', err);
    });
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, faceapi.resizeResults(detections, displaySize));
  }, 100);
});
