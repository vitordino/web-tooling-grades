import type { NextApiRequest, NextApiResponse } from "next"

export type StudentGrade = {
	name: string
}

const handler = (req: NextApiRequest, res: NextApiResponse<StudentGrade>) => {
	res.status(200).json({ name: "John Doe" })
}

export default handler
