export class Observer {
  constructor() {}
  update(key: string, s: Subject) {}
}

export class Subject {
  type: string
  observers: Observer[];

  constructor() {
    this.type = ''
    this.observers = [];
  }

  addObserver(o: Observer) {
    this.observers.push(o);
  }

  delObserver(_o: Observer) {
    this.observers.pop()
  }

  notify(key: string) {
    this.observers.forEach(o => {
      o.update(key, this);
    });
  }
}

export class View extends Subject {
  constructor() {
    super()
  }
}

export class Presenter extends Observer {
  constructor() {
    super()
  }

  createView() {
  }
}

export class Model extends Subject {
  constructor() {
    super()
  }
}
