
"use client"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Trash2, Plus } from "lucide-react"
import { JSX } from "react/jsx-runtime"

// Type definitions
type JobStatus = "Applied" | "OA" | "Interview" | "Offer" | "Rejected"
type AssessmentType = "OA" | "Interview"

interface Job {
  company: string
  role: string
  status: JobStatus
}

interface Assessment {
  company: string
  type: AssessmentType
  date: string
}

interface NewJobForm {
  company: string
  role: string
  status: JobStatus
}

interface NewAssessmentForm {
  company: string
  type: AssessmentType | ""
  date: string
}

export default function Work(): JSX.Element {
  const [jobs, setJobs] = useState<Job[]>([
    { company: "Google", role: "SDE Intern", status: "Applied" },
  ])

  const [assessments, setAssessments] = useState<Assessment[]>([
    { company: "Amazon", type: "OA", date: "2025-09-12" },
  ])

  const [newJob, setNewJob] = useState<NewJobForm>({
    company: "",
    role: "",
    status: "Applied",
  })

  const [newAssessment, setNewAssessment] = useState<NewAssessmentForm>({
    company: "",
    type: "",
    date: "",
  })

  // Handlers
  const addJob = () => {
    if (!newJob.company || !newJob.role || !newJob.status) return
    setJobs([...jobs, newJob])
    setNewJob({ company: "", role: "", status: "Applied" })
  }

  const deleteJob = (index: number) => {
    setJobs(jobs.filter((_, idx) => idx !== index))
  }

  const addAssessment = () => {
    if (!newAssessment.company || !newAssessment.type || !newAssessment.date)
      return
    setAssessments([...assessments, newAssessment as Assessment])
    setNewAssessment({ company: "", type: "", date: "" })
  }

  const deleteAssessment = (index: number) => {
    setAssessments(assessments.filter((_, idx) => idx !== index))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        💼 Work Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Applications */}
        <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg border border-neutral-700 bg-neutral-800"
                >
                  <div>
                    <p className="font-semibold text-white">{job.company}</p>
                    <p className="text-sm text-gray-400">{job.role}</p>
                    <span className="text-gray-200">{job.status}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => deleteJob(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {/* Add Job Form */}
              <div className="space-y-2 border-t border-neutral-700 pt-3">
                <Input
                  placeholder="Company"
                  value={newJob.company}
                  className="bg-black border-neutral-700 text-white placeholder-gray-500"
                  onChange={(e) =>
                    setNewJob({ ...newJob, company: e.target.value })
                  }
                />
                <Input
                  placeholder="Role"
                  value={newJob.role}
                  className="bg-black border-neutral-700 text-white placeholder-gray-500"
                  onChange={(e) =>
                    setNewJob({ ...newJob, role: e.target.value })
                  }
                />
                <Select
                  value={newJob.status}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, status: value as JobStatus })
                  }
                >
                  <SelectTrigger className="bg-black border-neutral-700 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 text-white">
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="OA">OA</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="w-full bg-white text-black hover:bg-gray-300"
                  onClick={addJob}
                >
                  <Plus size={16} className="mr-2" /> Add Job
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessments */}
        <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">OA & Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessments.map((assessment, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg border border-neutral-700 bg-neutral-800"
                >
                  <div>
                    <p className="font-semibold text-white">{assessment.company}</p>
                    <p className="text-sm text-gray-400">{assessment.type}</p>
                    <span className="flex items-center gap-1 text-gray-200">
                      <Calendar size={16} /> {assessment.date}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => deleteAssessment(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {/* Add Assessment Form */}
              <div className="space-y-2 border-t border-neutral-700 pt-3">
                <Input
                  placeholder="Company"
                  value={newAssessment.company}
                  className="bg-black border-neutral-700 text-white placeholder-gray-500"
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      company: e.target.value,
                    })
                  }
                />
                <Select
                  value={newAssessment.type}
                  onValueChange={(value) =>
                    setNewAssessment({
                      ...newAssessment,
                      type: value as AssessmentType,
                    })
                  }
                >
                  <SelectTrigger className="bg-black border-neutral-700 text-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 text-white">
                    <SelectItem value="OA">OA</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                  </SelectContent>
                </Select>
                <Input
              type="date"
              value={newAssessment.date}
              className="bg-black border-neutral-700 text-white placeholder-gray-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              onChange={(e) =>
                setNewAssessment({
                  ...newAssessment,
                  date: e.target.value,
                })
              }
            />

                <Button
                  className="w-full bg-white text-black hover:bg-gray-300"
                  onClick={addAssessment}
                >
                  <Plus size={16} className="mr-2" /> Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
