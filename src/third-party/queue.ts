class Queue<T = any> {
  #defferedQueue: T[] = [];
  #workingSet: Set<Promise<any>> = new Set();
  #isKilled = false;
  #concurrent: number;

  constructor(concurrent = 5) {
    if (concurrent < 1) throw new Error('make sure concurrent >=1');
    this.#concurrent = concurrent;
  }

  get inProgress() {
    return this.#workingSet.size;
  }

  private _workPush = () => {
    if (this.#isKilled) return;
    while (this.#workingSet.size < this.#concurrent && this.#defferedQueue.length > 0) {
      const item = this.#defferedQueue.shift() as T;
      const task = this.work(item);
      task.finally(() => {
        this.#workingSet.delete(task);
        console.log('delete!', this.#workingSet.entries());
        this._workPush();
      });
      this.#workingSet.add(task);
      console.log('add!', this.#workingSet.entries());
    }

    if (this.#workingSet.size === 0) this.drain();
  };

  drain() {
    console.log('empty...');
  }

  push(...item) {
    this.#defferedQueue.push(...item);
    this._workPush();
  }

  kill() {
    this.#workingSet.clear();
    this.#defferedQueue = [];
    this.#isKilled = true;
  }

  reset() {
    this.#isKilled = false;
  }

  async work(item) {
    return new Promise(resolve => {
      console.log('current - ', this.inProgress, 'default work, plz overload it', item);
      setTimeout(resolve, (Math.random() * 5000) | 0);
    });
  }
}

export default Queue;
