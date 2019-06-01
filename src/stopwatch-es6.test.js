import Stopwatch from "./stopwatch-es6";

describe("Stopwatch test", () => {
	let stopwatch;
	beforeEach(() => {
		stopwatch = new Stopwatch();
	});

	afterEach(() => {
		stopwatch = null;
	});

	test("should init property", () => {
		expect(stopwatch.startTime).toBe(0);
		expect(stopwatch.stopTime).toBe(0);
		expect(stopwatch.totalElapsed).toBe(0);
		expect(stopwatch.started).toBeFalsy();
	});

	test("stopwatch should be start", () => {
		stopwatch.start();
		expect(stopwatch.started).toBeTruthy();
	});

	test("stopwatch should be stop", () => {
		stopwatch.stop();
		expect(stopwatch.started).toBeFalsy();
	});

	test("stopwatch should be reset", () => {
		stopwatch.start();
		stopwatch.reset();
		stopwatch.stop();

		const resultObj = {
			hours: 0,
			milliseconds: 0,
			minutes: 0,
			seconds: 0
		};
		expect(stopwatch.getElapsed()).toMatchObject(resultObj);
	});

	test("stopwatch should be set elapsed", () => {
		stopwatch.setElapsed(1, 1, 1);
		const resultObj = {
			hours: 1,
			minutes: 1,
			seconds: 1,
			milliseconds: 0
		};
		expect(stopwatch.getElapsed()).toMatchObject(resultObj);
	});

	test("stopwatch should be get elapsed", () => {
		const resultObj = {
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		};
		expect(stopwatch.getElapsed()).toMatchObject(resultObj);
	});

	test("stopwatch should be set listener", () => {
		const listener = () => {};
		stopwatch.setListener(listener);
		expect(stopwatch.listener).toBe(listener);
	});

	test("stopwatch should call listener everytime", () => {
		jest.useFakeTimers();
		const listener = jest.fn();
		stopwatch.setListener(listener);
		expect(listener).not.toBeCalled();
		stopwatch.start();
		setTimeout(() => {
			expect(listener).toHaveBeenCalled();
			stopwatch.stop();
		}, 1500);
		jest.runOnlyPendingTimers();
	});
});
