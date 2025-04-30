import { Transform, Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateReservationDto {
	@IsDefined()
	@IsNotEmpty()
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			const [day, month, year] = value.split('-').map(Number);
			return new Date(year, month - 1, day);  // konversi manual
		}
		return value;
	})
	@IsDate()
	startDate: Date;

	@IsDefined()
	@IsNotEmpty()
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			const [day, month, year] = value.split('-').map(Number);
			return new Date(year, month - 1, day);  // konversi manual
		}
		return value;
	})
	@IsDate()
	endDate: Date;


	@IsDefined()
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	invoiceId: string;
}
