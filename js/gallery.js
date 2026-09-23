(function () {
  function loadPhotos() {
    return fetch("data/photos.json?v=" + Date.now(), { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("Could not load photos.json");
      return res.json();
    });
  }

  function createItem(photo, index, list) {
    var item = document.createElement("div");
    item.className = "gallery-item";

    var img = document.createElement("img");
    img.src = photo.thumb;
    img.alt = photo.alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    item.appendChild(img);

    item.addEventListener("click", function () {
      if (window.Lightbox) window.Lightbox.open(list, index);
    });

    return item;
  }

  function applyMasonrySpan(container, item, img) {
    var styles = getComputedStyle(container);
    var rowHeight = parseFloat(styles.getPropertyValue("grid-auto-rows")) || 8;
    var rowGap = parseFloat(styles.getPropertyValue("gap")) || 24;

    function setSpan() {
      var ratio = img.naturalHeight / img.naturalWidth;
      var renderedWidth = item.getBoundingClientRect().width;
      var renderedHeight = renderedWidth * ratio;
      var span = Math.ceil((renderedHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = "span " + span;
    }

    if (img.complete && img.naturalWidth) {
      setSpan();
    } else {
      img.addEventListener("load", setSpan);
    }
    window.addEventListener("resize", setSpan);
  }

  function renderInto(container, photos) {
    var mode = container.dataset.gallery;
    var layout = container.dataset.layout;
    var list = mode === "featured" ? photos.filter(function (p) { return p.featured; }) : photos;

    list.forEach(function (photo, index) {
      var item = createItem(photo, index, list);
      container.appendChild(item);
      if (layout === "masonry") {
        applyMasonrySpan(container, item, item.querySelector("img"));
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var containers = document.querySelectorAll("[data-gallery]");
    if (!containers.length) return;

    loadPhotos()
      .then(function (photos) {
        containers.forEach(function (container) {
          renderInto(container, photos);
        });
      })
      .catch(function (err) {
        console.error(err);
      });
  });
})();
