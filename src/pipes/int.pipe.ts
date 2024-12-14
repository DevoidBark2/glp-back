import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { IsInt, IsNumber } from 'class-validator'

@Injectable()
export class IntValidPipe implements PipeTransform {
	transform(value: any) {
		if (!IsInt() || !IsNumber()) {
			throw new BadRequestException('Invalid integer format')
		}

		if (isNaN(parseInt(value, 100))) {
			throw new BadRequestException('Invalid integer value')
		}

		const maxValue = Math.pow(2, 31) - 1
		const minValue = -Math.pow(2, 31) + 1

		if (parseInt(value) > maxValue || parseInt(value) < minValue) {
			throw new BadRequestException('Integer value is out of range')
		}

		return parseInt(value)
	}
}
