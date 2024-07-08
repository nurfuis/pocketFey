const debug = true;

export async function loadMap(int) {
  let mapList;

  try {
    const response = await fetch("/assets/stored_maps.json");
    if (!response.ok) {
      throw new Error(`Error fetching map list: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    mapList = data;
  } catch (error) {
    console.error("Error fetching map list:", error);
    return null; // Or handle the error differently
  }

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
