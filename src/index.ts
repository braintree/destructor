type TeardownFunction = () => void | Promise<void>;

class Destructor {
  private teardownRegistry: TeardownFunction[];
  private isTearingDown: boolean;

  constructor() {
    this.teardownRegistry = [];

    this.isTearingDown = false;
  }

  register(fn: TeardownFunction): void {
    this.teardownRegistry.push(fn);
  }

  async teardown(): Promise<void> {
    if (this.isTearingDown) {
      throw new Error("Destructor is already tearing down");
    }

    this.isTearingDown = true;

    await Promise.all(this.teardownRegistry.map((fn) => fn()));

    this.teardownRegistry = [];
    this.isTearingDown = false;
  }
}

export = Destructor;
