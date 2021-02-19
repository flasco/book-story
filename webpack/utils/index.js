const shuffle = arr => {
  const newArr = [...arr];
  const len = newArr.length;
  for (let i = len - 1; i >= 0; i--) {
    const index = Math.floor(Math.random() * i);
    [newArr[i], newArr[index]] = [newArr[index], newArr[i]];
  }

  return newArr;
};

const baseStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz012345678';

const getRandomId = () => {
  const arr = baseStr.split('');
  return shuffle(arr).slice(0, 6).join('');
};

exports.getRandomId = getRandomId;
