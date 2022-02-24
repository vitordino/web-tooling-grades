import type { NextPage } from "next"
import { FormEvent, useState } from "react"
import useSWR from "swr"
import fetcher from "src/utils/fetcher"
import { StudentGrade } from "src/pages/api/v1/grades/[student]"

const studentApiKey = (student?: string) => {
	if (!student) throw new Error("missing student")
	return `/api/v1/grades/${student}`
}

const useStudentGrade = (student?: string) =>
	useSWR<StudentGrade>(() => studentApiKey(student), fetcher)

const sortObjectByKeys = (o: Record<string, string>) =>
	Object.keys(o)
		.sort()
		// @ts-expect-error i’m lazy to type this
		.reduce((r, k) => ((r[k] = o[k]), r), {})

const Home: NextPage = () => {
	const [student, setStudent] = useState("")
	const [search, setSearch] = useState("")
	const { data, isValidating } = useStudentGrade(search)

	const onSubmit = (e: FormEvent) => {
		e.preventDefault()
		setSearch(student)
	}

	const errorMessage = data?.message
	const githubHandle = data?.["github handle"]
	const sortedData = data && sortObjectByKeys(data)

	return (
		<>
			<style>
				{`
          body {
            font-family: sans-serif;
          }

          table {
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            text-align: left;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
          }

          table thead tr {
              background-color: #009879;
              color: #ffffff;
              text-align: left;
          }

          table th,
          table td {
              padding: 12px 15px;
              font-weight: default !important;
          }

          table tbody tr {
              border-bottom: 1px solid #dddddd;
          }
        `}
			</style>
			<form onSubmit={onSubmit}>
				<input
					value={student}
					onChange={e => setStudent(e.target.value)}
					placeholder="github user"
				/>
				<button disabled={!student}>search</button>
			</form>
			{errorMessage && <pre>{errorMessage}</pre>}
			{isValidating && !data && <pre>loading...</pre>}
			{!errorMessage && sortedData && (
				<table>
					<thead>
						<tr>
							{Object.keys(sortedData).map(k => (
								<th key={k}>{k}</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							{Object.values<string | number | undefined>(sortedData).map(
								(k, i) => (
									<th key={i}>
										{!k?.toString().includes("github.com") ? (
											k
										) : (
											<a href={k.toString()}>
												{k
													.toString()
													.replace(`https://github.com/${githubHandle}`, "")}
											</a>
										)}
									</th>
								)
							)}
						</tr>
					</tbody>
				</table>
			)}
		</>
	)
}

export default Home
