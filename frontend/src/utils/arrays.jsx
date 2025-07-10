export function insertItemIntoArrayAtIndex(arr, item, index) {
    const newArr = [...arr];
    newArr.splice(index, 0, item);
    return newArr;
}

export function editItemInArrayById(arr, updatedItem, targetId) {
    return arr.map(x => x.id == targetId? updatedItem: x);
}

export function addItemToArray(arr, item) {
    return [...arr, item];
}

export function deleteItemFromArrayById(arr, targetId) {
    return arr.filter(x => x.id !== targetId);
}

export function swapItemsInArray(arr, index1, index2) {
  if (index1 === index2) return [...arr]; // no-op

  const newArr = [...arr];
  const temp = newArr[index1];
  newArr[index1] = newArr[index2];
  newArr[index2] = temp;

  return newArr;
}

export function reindexTravelDays(days) {//ONLY FOR TRAVELDAYS
  return [...days] // shallow copy
    .sort((a, b) => a.index - b.index)
    .map((day, i) => ({ ...day, index: i }));
}