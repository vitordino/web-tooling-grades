import type { NextPage } from "next"
import { useState } from "react"
import useSWR from "swr"
import fetcher from "../utils/fetcher"
import { StudentGrade } from "./api/v1/grades/[student]"

const studentApiKey = (student?: string) => {
	if (!student) throw new Error("missing student")
	return `/api/v1/grades/${student}`
}
const useStudentGrade = (student?: string) =>
	useSWR<StudentGrade>(() => studentApiKey(student), fetcher)

const Home: NextPage = () => {
	const [student, setStudent] = useState("")
	const { data, isValidating, error } = useStudentGrade(student)

	return (
		<div>
			<input value={student} onChange={e => setStudent(e.target.value)} />
			<pre>{JSON.stringify({ data, isValidating, error })}</pre>
		</div>
	)
}

export default Home
