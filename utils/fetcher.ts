const fetcher = async (endpoint: string) =>
	await fetch(endpoint).then(x => x.json())

export default fetcher
