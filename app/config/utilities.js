export function search(todos, sear) {
  let pattern = new RegExp(sear.toLowerCase(), "g");
  let newTodos = todos.filter((item) => {
    if (item.title.toLowerCase().match(pattern) != null) return item;
  });

  return newTodos;
}

export function deleteItem(array, dItem) {
  let newArray = array.filter((item) => {
    if (item.id != dItem.id) return item;
  });

  return newArray;
}
