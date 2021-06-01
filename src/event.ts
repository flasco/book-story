type fnType = (...args: any[]) => void;

class Eventer {
  events = new Map<string, Map<fnType, fnType>>();

  emit = (name: string, ...args: any[]) => {
    const m = this.events.get(name);
    if (!m) throw new Error(`method ${name} not registered`);
    m.forEach(fn => fn(...args));
  };

  on = (name: string, fn: fnType) => {
    const m = this.events.get(name);
    if (!m) {
      const nMap = new Map();
      nMap.set(fn, fn);
      this.events.set(name, nMap);
    } else {
      // 不允许同一个签名的 function 重复注册
      if (m.has(fn)) throw new Error(`method already registered`);
      m.set(fn, fn);
    }
  };

  off = (name: string, fn: fnType) => {
    const m = this.events.get(name);
    if (m) {
      m.delete(fn);
    }
  };
}

export const ee = new Eventer();
