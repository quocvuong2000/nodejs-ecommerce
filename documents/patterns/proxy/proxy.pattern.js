class Leader {
  receiveRequest(offer) {
    console.log(`Boss said:: OK! :: ${offer}`);
  }
}

class Secretary {
  constructor() {
    this.leader = new Leader();
  }

  receiveRequest(offer) {
    // You can add extra handling here if needed, e.g., logging the date.
    this.leader.receiveRequest(offer);
  }
}

class Developer {
  constructor(offer) {
    this.offer = offer;
  }

  applyFor(target) {
    target.receiveRequest(this.offer);
  }
}

// How to use
const devs = new Developer('anonymously asking for up to 5K USD');
devs.applyFor(new Secretary());
