import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'else'
})
export class ElsePipe implements PipeTransform {
	transform(value: unknown, elseString: string): unknown {
		if (value) {
			return value;
		} else {
			return elseString;
		}
	}
}
