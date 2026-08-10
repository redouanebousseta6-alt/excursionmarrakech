/**
 * About page — gallery lightbox
 */
document.addEventListener("DOMContentLoaded", async function () {
  if (window.EM && EM.loadConfig) {
    await EM.loadConfig();
    EM.setActiveNav("about");
  }

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-gallery-src]"));
  if (!items.length) return;

  var lightbox = document.getElementById("about-lightbox");
  var imageEl = document.getElementById("about-lightbox-image");
  var countEl = document.getElementById("about-lightbox-count");
  var closeBtn = document.getElementById("about-lightbox-close");
  var prevBtn = document.getElementById("about-lightbox-prev");
  var nextBtn = document.getElementById("about-lightbox-next");
  var index = 0;

  function show(i) {
    index = (i + items.length) % items.length;
    var src = items[index].getAttribute("data-gallery-src");
    imageEl.src = src;
    imageEl.alt = "Marrakech gallery image " + (index + 1);
    if (countEl) countEl.textContent = index + 1 + " / " + items.length;
  }

  function open(i) {
    show(i);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    imageEl.removeAttribute("src");
  }

  items.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      open(i);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (prevBtn)
    prevBtn.addEventListener("click", function () {
      show(index - 1);
    });
  if (nextBtn)
    nextBtn.addEventListener("click", function () {
      show(index + 1);
    });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
});
