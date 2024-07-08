const debug = false;

export async function loadResources() {
  let images = {};
  let imageList = {
    air: "/assets/sprites/air.png",
    feyBrewsterTileSet: "/assets/sprites/feyBrewsterTileSet.png",
    player: "/assets/sprites/player.png",
    shadow: "/assets/sprites/shadow.png",
  };

  fetch("/assets/image_list.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      imageList = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  Object.keys(imageList).forEach((key) => {
    const img = new Image();
    img.src = imageList[key];

    if (debug) {
      console.log("Loading image:", imageList[key]);
    }

    images[key] = {
      image: img,
      isLoaded: false,
      width: null,
      height: null,
    };

    img.onload = () => {
      images[key].isLoaded = true;
      if (Object.values(images).every((image) => image.isLoaded)) {
      }
    };
  });
  return { images: images, sounds: null };
}