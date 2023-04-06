export function search(todos, sear) {
  let pattern = new RegExp(sear.toLowerCase(), "g");
  let newTodos = {};

  Object.keys(todos).filter((key) => {
    if (todos[key].title.toLowerCase().match(pattern) != null)
      newTodos[key] = todos[key];
  });
  x;

  return newTodos;
}

export function deleteItem(array, dItem) {
  let newArray = array.filter((item) => {
    if (item.id != dItem.id) return item;
  });

  return newArray;
}

export function getDates(startDate, endDate) {
  const dates = [];
  let currentDate = startDate;
  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}
