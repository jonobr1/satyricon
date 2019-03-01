var iframe = document.querySelector('#visualization iframe');
var closeup = document.querySelector('#close-up');
var images = document.querySelectorAll('#slideshow img');
var content = closeup.querySelector('div.content');
var anchors = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');

images = Array.prototype.slice.call(images, 0);
images.index = 0;

if (iframe) {
  scroll();
  window.addEventListener('scroll', scroll, false);
}

closeup.querySelector('.exit').addEventListener('click', close, false);
closeup.querySelector('.prev').addEventListener('click', prev, false);
closeup.querySelector('.next').addEventListener('click', next, false);

for (var i = 0; i < images.length; i++) {
  var image = images[i];
  image.addEventListener('click', show, false);
}

permalink(anchors);

function scroll() {

  if (!iframe.contentWindow) {
    return;
  }

  var height = window.innerHeight;
  var rect = iframe.getBoundingClientRect();
  var message = 'pause';

  if (rect.top >= - rect.height && rect.top <= height) {
    message = 'play';
  }

  iframe.contentWindow.postMessage(message, window.location.href);

}

function show(e) {
  closeup.style.display = 'block';
  var reference = e.target;
  images.index = images.indexOf(reference);
  updateImage();
}

function next() {
  images.index = mod(images.index + 1, images.length);
  updateImage();
}

function prev() {
  images.index = mod(images.index - 1, images.length);
  updateImage();
}

function updateImage() {
  var reference = images[images.index];
  if (reference) {
    var src = reference.src;
    content.style.backgroundImage = ['url(', src, ')'].join('');
  }
}

function mod(v, l) {
  while (v < 0) {
    v += l;
  }
  return v % l;
}

function close(e) {
  closeup.style.display = 'none';
}

function permalink(elements) {

  for (var i = 0; i < elements.length; i++) {
    var elem = elements[i];
    var anchor = document.createElement('a');
    anchor.classList.add('hash');
    anchor.href = [window.location.href.replace(window.location.hash, ''), '#', elem.id].join('');
    elem.appendChild(anchor);
  }

}
