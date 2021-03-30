import Destructor = require("../");

describe("Destructor", () => {
  describe("teardown", () => {
    it("empties collection of teardown functions", async () => {
      const spyOne = jest.fn();
      const spyTwo = jest.fn();
      const destructor = new Destructor();

      destructor.register(spyOne);
      destructor.register(spyTwo);

      await destructor.teardown();

      expect(spyOne).toBeCalledTimes(1);
      expect(spyTwo).toBeCalledTimes(1);

      await destructor.teardown();
      await destructor.teardown();
      await destructor.teardown();

      expect(spyOne).toBeCalledTimes(1);
      expect(spyTwo).toBeCalledTimes(1);
    });

    it("rejects if a syncronous function is registered and throws an error", async () => {
      expect.assertions(1);

      const destructor = new Destructor();

      destructor.register(() => {
        throw new Error("message");
      });

      try {
        await destructor.teardown();
      } catch (e) {
        expect(e.message).toBe("message");
      }
    });

    it("calls supplied callback with an error if given an asynchronous function", async () => {
      expect.assertions(1);

      const destructor = new Destructor();

      destructor.register(() => {
        return Promise.reject(new Error("message"));
      });

      try {
        await destructor.teardown();
      } catch (e) {
        expect(e.message).toBe("message");
      }
    });

    it("rejects with an error when calling teardown twice if already in progress", async () => {
      expect.assertions(3);

      const destructor = new Destructor();
      let originalTeardownComplete = false;

      destructor.register(() => {
        return new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      const originalPromise = destructor.teardown().then(() => {
        originalTeardownComplete = true;
      });

      try {
        await destructor.teardown();
      } catch (err) {
        expect(err.message).toBe("Destructor is already tearing down");
        expect(originalTeardownComplete).toBe(false);

        await originalPromise;

        expect(originalTeardownComplete).toBe(true);
      }
    });
  });
});
