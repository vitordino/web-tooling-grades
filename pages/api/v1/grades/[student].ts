import type { NextApiRequest, NextApiResponse } from "next"
import fetcher from "../../../../utils/fetcher"

const apiKey = process.env.AIRTABLE_KEY
const base = process.env.AIRTABLE_BASE
const tableName = process.env.AIRTABLE_TABLE_NAME

const url = `https://api.airtable.com/v0/${base}/${tableName}?view=Grid%20view`
const headers = { Authorization: `Bearer ${apiKey}` }

export type StudentGrade = {
	"github handle": string
	"full name": string
} & Record<string, string>

export type ExpectedInput = {
	records?: { fields: StudentGrade }[]
}

const get = async (): Promise<ExpectedInput | undefined> =>
	await fetcher(url, { headers })

const compareLowercase = (a: string, b: string) =>
	a.toLowerCase() === b.toLowerCase()

const handler = async (req: NextApiRequest, res: NextApiResponse<unknown>) => {
	const { student } = req.query
	if (!student || typeof student !== "string") {
		return res.status(400).json({ message: "bad format" })
	}

	try {
		const data = await get()
		const allStudentsData = data?.records?.map(({ fields }) => fields)
		const studentData = allStudentsData?.find(x =>
			compareLowercase(x["github handle"], student)
		)

		console.log({ studentData, allStudentsData, data })

		if (!studentData) res.status(404).json({ message: "not found" })
		return res.status(200).json(studentData)
	} catch {
		console.log("500 error")
		return res.status(500).json({ message: "server error" })
	}
}

export default handler
