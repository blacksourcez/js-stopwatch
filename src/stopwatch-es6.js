class Stopwatch {
	constructor(listener, resolution, countUp) {
		this.startTime = 0;
		this.stopTime = 0;
		this.totalElapsed = 0; // * elapsed number of ms in total
		this.started = false;
		this.listener = listener != undefined ? listener : null; // * function to receive onTick events
		this.countUp = typeof countUp !== "undefined" ? countUp : true;
		this.tickResolution = resolution != undefined ? resolution : 500; // * how long between each tick in milliseconds
		this.tickInterval = null;

		// * pretty static vars
		this.onehour = 1000 * 60 * 60;
		this.onemin = 1000 * 60;
		this.onesec = 1000;
	}

	start() {
		const delegate = (that, method) => {
			return () => {
				return method.call(that);
			};
		};
		if (!this.started) {
			this.startTime = new Date().getTime();
			this.stopTime = 0;
			this.started = true;
			this.tickInterval = setInterval(
				delegate(this, this.onTick),
				this.tickResolution
			);
		}
	}

	stop() {
		if (this.started) {
			this.stopTime = new Date().getTime();
			this.started = false;
			const elapsed = this.stopTime - this.startTime;
			this.totalElapsed += elapsed;
			if (this.tickInterval != null) clearInterval(this.tickInterval);
		}
		return this.getElapsed();
	}

	reset() {
		this.totalElapsed = 0;
		// * if watch is running, reset it to current time
		this.startTime = new Date().getTime();
		this.stopTime = this.startTime;
		if (!this.countUp) {
			this.totalElapsed = this.initialElapsed;
		}
		if (this.tickInterval != null) {
			const delegate = function(that, method) {
				return function() {
					return method.call(that);
				};
			};
			clearInterval(this.tickInterval);
			this.tickInterval = setInterval(
				delegate(this, this.onTick),
				this.tickResolution
			);
		}
	}

	restart() {
		this.stop();
		this.reset();
		this.start();
	}

	getElapsed() {
		// * if watch is stopped, use that date, else use now
		let elapsed = 0;
		if (this.started) elapsed = new Date().getTime() - this.startTime;
		elapsed += this.totalElapsed;

		if (!this.countUp) {
			elapsed = Math.max(2 * this.initialElapsed - elapsed, 0);
		}

		const hours = parseInt(elapsed / this.onehour);
		elapsed %= this.onehour;
		const mins = parseInt(elapsed / this.onemin);
		elapsed %= this.onemin;
		const secs = parseInt(elapsed / this.onesec);
		const ms = elapsed % this.onesec;

		return {
			hours: hours,
			minutes: mins,
			seconds: secs,
			milliseconds: ms
		};
	}

	setElapsed(hours, mins, secs) {
		// this.reset();
		this.totalElapsed = 0;
		this.startTime = new Date().getTime();
		this.stopTime = this.startTime;
		this.totalElapsed += hours * this.onehour;
		this.totalElapsed += mins * this.onemin;
		this.totalElapsed += this.countUp
			? secs * this.onesec
			: (secs + 1) * this.onesec - 1;
		this.totalElapsed = Math.max(this.totalElapsed, 0); // * No negative numbers
		this.initialElapsed = this.totalElapsed;
		if (this.tickInterval != null) {
			const delegate = function(that, method) {
				return function() {
					return method.call(that);
				};
			};
			clearInterval(this.tickInterval);
			this.tickInterval = setInterval(
				delegate(this, this.onTick),
				this.tickResolution
			);
		}
	}

	toString(milliseconds = false) {
		const zpad = function(no, digits) {
			no = no.toString();
			while (no.length < digits) no = "0" + no;
			return no;
		};
		const e = this.getElapsed();
		return (
			zpad(e.hours, 2) +
			":" +
			zpad(e.minutes, 2) +
			":" +
			zpad(e.seconds, 2) +
			(milliseconds ? "." + zpad(e.milliseconds, 3) : "")
		);
	}

	setListener(listener) {
		this.listener = listener;
	}

	onTick() {
		if (this.listener != null) {
			this.listener(this);
		}
	}
}

export default Stopwatch;
