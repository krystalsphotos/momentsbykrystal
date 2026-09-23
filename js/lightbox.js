(function () {
  var state = { list: [], index: 0 };
  var el, imgEl, captionEl;

  function build() {
    el = document.createElement("div");
    el.className = "lightbox";
    el.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lightbox-next" aria-label="Next">&#8250;</button>' +
      '<div class="lightbox-caption"></div>';
    document.body.appendChild(el);

    imgEl = el.querySelector("img");
    captionEl = el.querySelector(".lightbox-caption");

    el.querySelector(".lightbox-close").addEventListener("click", close);
    el.querySelector(".lightbox-prev").addEventListener("click", function (e) {
      e.stopPropagation();
      show(state.index - 1);
    });
    el.querySelector(".lightbox-next").addEventListener("click", function (e) {
      e.stopPropagation();
      show(state.index + 1);
    });
    el.addEventListener("click", function (e) {
      if (e.target === el) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!el.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(state.index - 1);
      if (e.key === "ArrowRight") show(state.index + 1);
    });

    var touchStartX = null;
    el.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    });
    el.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) show(state.index + (dx < 0 ? 1 : -1));
      touchStartX = null;
    });
  }

  function show(index) {
    var len = state.list.length;
    state.index = (index + len) % len;
    var photo = state.list[state.index];
    imgEl.src = photo.full;
    imgEl.alt = photo.alt || "";
    captionEl.textContent = photo.category || "";
  }

  function open(list, index) {
    if (!el) build();
    state.list = list;
    show(index);
    el.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    el.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  window.Lightbox = { open: open, close: close };
})();
