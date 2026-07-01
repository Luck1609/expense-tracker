export function pagination(currentPage: number, tableLength: number): (number | string)[] {
	const delta = 2,
		left = currentPage - delta,
		right = currentPage + delta + 1
		const range = []
	let last: number

	for (let page = 1; page <= tableLength; page++) {
		if (page === 1 || page === tableLength || (page >= left && page < right)) {
			range.push(page);
		}
  }

  const paginatedResult = range.reduce((rangeWithDots: (number | string)[], page: number) => {
		if (last) {
      if (page - last === 2) {
        rangeWithDots = [...rangeWithDots, last + 1]
			} else if (page - last !== 1) {
        rangeWithDots = [...rangeWithDots, "..."]
			}
		}
		rangeWithDots = [...rangeWithDots, page]
    last = page;
    
    return rangeWithDots
  }, [])
	return paginatedResult;
}