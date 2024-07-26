import { propertyHandlers } from "./propertyHandlers";
export function handleProperty(propertyName, propertyValue, newEntity) {
  const debug = false;

  const handler = propertyHandlers[propertyName];
  if (handler) {
    if (debug) {
      console.log(newEntity, propertyValue);
    }
    handler(newEntity, propertyValue);
  } else {
    console.log(
      "warn",
      `${newEntity.name}`,
      `Unknown property: ${propertyName}`
    );
  }
}
