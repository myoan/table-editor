export class Observer {
  constructor() {
  }

  update(s: Subject) {
  }
}

export class Subject {
  observers: Observer[];
  constructor() {
    this.observers = [];
  }

  addObserver(o: Observer) {
    this.observers.push(o);
  }

  delObserver(_o: Observer) {
    this.observers.pop()
  }

  notifyObservers() {
    this.observers.forEach(o => {
      o.update(this);
    });
  }
}