import {useState, useEffect} from 'react';
import {useGlobal} from 'reactn';

export const updateCartItem = (id) => {
  const [value, setValue] = useState(0);
  const [count, setCount] = useGlobal('count');
  const [list, setList] = useGlobal('list');

  useEffect(() => {
    checkCountValue();
  }, []);

  function checkCountValue() {
    var index = list.findIndex((x) => x.id === id);
    if (index !== -1) {
      setValue(list[index].count);
    }
  }

  function updateFromKeyboard(num) {
    setValue(num);
    if (list.length === 0) {
      setList([{id: id, count: num}]);
    } else {
      updateItem(id, {count: num});
    }
  }

  function updateItem(id, itemAttributes) {
    var index = list.findIndex((x) => x.id === id);
    if (index === -1) {
      // handle error
      setList([...list, {id: id, count: itemAttributes.count}]);
    } else {
      setList([
        ...list.slice(0, index),
        Object.assign({}, list[index], itemAttributes),
        ...list.slice(index + 1),
      ]);
    }
  }

  function increment() {
    if (value < 10) {
      setCount(count + 1);
    }
  }

  function decrement() {
    if (value > 0) {
      setCount(count - 1);
    }
  }

  return [value, updateFromKeyboard, updateItem, increment, decrement];
};
