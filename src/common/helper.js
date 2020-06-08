const _ = require("lodash");

// removeCard removes a specific card from ALL hands
export function removeCard(hands, name) {
  const removeFromHand = (arr) =>
    _.filter(arr, (x) => !_.isEqual(x.name, name));
  return _.mapValues(hands, (arr) => removeFromHand(arr));
}
