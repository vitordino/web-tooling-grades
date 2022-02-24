const fetcher = async (input: RequestInfo, info?: RequestInit) =>
	await fetch(input, info).then(x => x.json())

export default fetcher
