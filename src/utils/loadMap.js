const debug = false;

import mapList from "../../assets/stored_maps.json";

export async function loadMap(int) {
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
