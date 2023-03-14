export default function search(todos, sear) {
  let pattern = new RegExp(sear.toLowerCase(), "g");
  let newTodos = todos.filter((item) => {
    if (item.title.toLowerCase().match(pattern) != null) return item;
  });

  return newTodos;
}
