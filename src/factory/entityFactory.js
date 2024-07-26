import { handleProperty } from "./handleProperty.js";
import { Vector2 } from "../../../utils/Vector2.js";
import { Sprite } from "../../Sprite.js";
import { resources } from "../../../utils/Resource.js";
export function entityFactory(scriptData, newEntity) {
  const shadow = new Sprite({
    resource: resources.images.shadow,
    frameSize: new Vector2(32, 32),
    position: new Vector2( -16, -24),
    scale: 2,
  }); 
  newEntity.shadow = shadow;

  const body = new Sprite({
    resource: resources.images.air,
  });
  newEntity.body = body; // add as property in case you want to swap bodies and restore the original

  const entityType = scriptData.type;
  // newEntity.type = entityType;
  console.log("info", newEntity.type);

  const entityName = scriptData.name; // role
  newEntity.name = entityName;

  const entityVisible = scriptData.visible; // visibility
  newEntity.invisible = !entityVisible;

  const entityRotation = scriptData.rotation; // facing dir
  newEntity.rotation = entityRotation;

  const entityWidth = scriptData.width; // size
  const entityHeight = scriptData.height; // size
  newEntity.width = entityWidth;
  newEntity.height = entityHeight;

  const entityProperties = scriptData.properties;

  if (entityProperties) {
    for (let i = 0; i < entityProperties.length; i++) {
      const property = entityProperties[i];
      const propertyName = property.name;
      const propertyValue = property.value;
      handleProperty(propertyName, propertyValue, newEntity);
    }
  }

  
  newEntity.addChild(shadow);  

  newEntity.body.buildFrameMap();
  newEntity.addChild(newEntity.body); // add the sprite as a child to do update, draw steps


}
