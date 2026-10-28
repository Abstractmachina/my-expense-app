import dateFormat from "dateformat";
/***
 * formats date strings as "dd/mm/yy". will return "Today", "Yesterday", or the formatted date.
 */
export const formatDateTime = (
	timestamp: string,
	ignoreToday?: boolean,
): string => {
	const currentDate = new Date();

	const parsedDate = new Date(Date.parse(timestamp));

	if (currentDate.getFullYear() === parsedDate.getFullYear()) {
		if (currentDate.getMonth() === parsedDate.getMonth()) {
			if (currentDate.getDate() === parsedDate.getDate()) {
				return ignoreToday ? standardFormat(timestamp) : "Today";
			} else if (currentDate.getDate() - 1 === parsedDate.getDate()) {
				return ignoreToday ? standardFormat(timestamp) : "Yesterday";
			}
		}
	}

	return standardFormat(timestamp);
};

const standardFormat = (timestamp: string): string =>
	dateFormat(new Date(Date.parse(timestamp)), "dd/mm/yy");

/***
 * compares dateStrings as full dates (year-month-day). returns 0 if equal, -1 if a < b, 1 if a > b
 */
export function compareDates(a: string, b: string): 1 | 0 | -1 {
	const parsedA = new Date(Date.parse(a));
	const parsedB = new Date(Date.parse(b));

	if (parsedA.getFullYear() > parsedB.getFullYear()) {
		return 1;
	} else if (parsedA.getFullYear() < parsedB.getFullYear()) {
		return -1;
	} else {
		if (parsedA.getMonth() > parsedB.getMonth()) {
			return 1;
		} else if (parsedA.getMonth() < parsedB.getMonth()) {
			return -1;
		} else {
			if (parsedA.getDate() > parsedB.getDate()) {
				return 1;
			} else if (parsedA.getDate() < parsedB.getDate()) {
				return -1;
			} else {
				return 0;
			}
		}
	}
}

/***
 * Compares a raw date string with a formatted date with the shape of "dd/mm/yy".
 */
export function isEqualToformattedDates(
	dateString: string,
	formattedDate: string,
): boolean {
	const processedDate = formatDateTime(dateString, true);
	return processedDate === formattedDate;
}
