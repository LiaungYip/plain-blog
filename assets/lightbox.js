(function () {
  var lb = document.createElement('div');
  lb.id = 'img-lightbox';
  lb.innerHTML = '<button id="img-lightbox-close" aria-label="Close">\u00d7</button><img id="img-lightbox-img" src="" alt="">';
  document.body.appendChild(lb);
  var lbImg = document.getElementById('img-lightbox-img');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('active');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.img-lightbox-trigger').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var img = el.querySelector('img');
      open(el.dataset.full, img ? img.alt : '');
    });
  });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.id === 'img-lightbox-close') close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
}());
