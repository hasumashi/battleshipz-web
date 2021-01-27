import { ElsePipe } from './else.pipe';

describe('ElsePipe', () => {
	it("create an instance", () => {
		const pipe = new ElsePipe();
		expect(pipe).toBeTruthy();
	});

	it("should return original value if it's truthy", () => {
		const pipe = new ElsePipe();
		const truthyNumber = 1234;
		const truthyString = ' ';
		const elseString = 'else';

		expect(pipe.transform(truthyNumber, elseString)).toBe(truthyNumber);
		expect(pipe.transform(truthyString, elseString)).toBe(truthyString);
	})

	it("should return elseString if original value is falsy", () => {
		const pipe = new ElsePipe();
		const falsyNumber = 0;
		const falsyString = '1234';
		const elseString = 'else';

		expect(pipe.transform(falsyNumber, elseString)).toBe(elseString);
		expect(pipe.transform(falsyString, elseString)).toBe(elseString);
	})
});
