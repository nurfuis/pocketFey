const debug = true;

export async function loadMap(int) {
  let mapList;

  fetch("/pocketFey/assets/stored_maps.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      mapList = data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  console.log(mapList, int);
  const mapPath = mapList[int];

  if (debug) {
    console.log("Loading map:", mapPath);
  }

  try {
    const response = await fetch(mapPath);
    if (!response.ok) {
      throw new Error(`Error fetching map: ${response.statusText}`);
    }
    const mapData = await response.json();
    return mapData;
  } catch (error) {
    console.error("Error loading map:", error);
    return null; // Or handle the error differently
  }
}
