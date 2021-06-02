import { Eventer as EE } from '@/event';

interface IPayload<T> {
  id: number;
  content: T;
  isWorking?: number;
}

class Queue<T = any> {
  _id = 0;
  _preArr: IPayload<T>[] = [];
  _workArr: IPayload<T>[] = [];
  _inProcess = 0;
  _workEMT = new EE();
  _concurrent: number;
  constructor(concurrent) {
    this._concurrent = concurrent || 5;

    this._workEMT.on('work', this._workRun.bind(this));
    this._workEMT.on('start', this._workPush.bind(this));
  }

  _workPush() {
    while (this._preArr.length > 0 && this._workArr.length < this._concurrent) {
      const item = this._preArr.shift() as IPayload<T>;
      this._workArr.push(item);
    }

    const totalLen = this._workArr.length + this._preArr.length;

    if (totalLen < 1 && this._inProcess < 1) this.drain();
    else this._workEMT.emit('work');
  }

  async _workRun() {
    const workLen = this._workArr.length;

    for (let i = 0; i < workLen; i++) {
      const current = this._workArr[i];
      if (current && current.isWorking !== 1) {
        current.isWorking = 1;
        this._inProcess++;
        await this.work(current.content);
        this._inProcess--;
        const pos = this._workArr.findIndex(val => current.id === val.id);
        this._workArr.splice(pos, 1);

        this._workEMT.emit('start');
      }
    }
  }

  drain() {
    console.log('empty...');
  }

  push(...item) {
    const works = item.map(i => ({
      id: this._id++,
      content: i,
    }));
    this._preArr.push(...works);
    this._workArr.length < this._concurrent && this._workEMT.emit('start');
  }

  kill() {
    this._workArr = [];
    this._preArr = [];
  }

  async work(item) {
    return new Promise(resolve => {
      console.log('default work, plz overload it', item);
      setTimeout(resolve, (Math.random() * 5000) | 0);
    });
  }
}

export default Queue;
