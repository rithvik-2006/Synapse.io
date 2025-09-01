"use client"
import { useState, useEffect } from "react"
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


type JobStatus = "Applied" | "OA" | "Interview" | "Offer" | "Rejected"
type AssessmentType = "OA" | "Interview"

interface Job {
  _id?: string
  company: string
  role: string
  status: JobStatus
}

interface Assessment {
  _id?: string
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
  const [jobs, setJobs] = useState<Job[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)

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


  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/work/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.data || [])
      } else {
        console.error('Failed to fetch jobs')
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }


  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/work/assessments')
      if (response.ok) {
        const data = await response.json()
        setAssessments(data.data || [])
      } else {
        console.error('Failed to fetch assessments')
      }
    } catch (error) {
      console.error('Error fetching assessments:', error)
    }
  }


  useEffect(() => {
    fetchJobs()
    fetchAssessments()
  }, [])


  const addJob = async () => {
    if (!newJob.company || !newJob.role || !newJob.status) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/work/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      })
      
      if (response.ok) {
        await fetchJobs()
        setNewJob({ company: "", role: "", status: "Applied" })
      } else {
        const error = await response.json()
        alert(`Failed to add job: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding job:', error)
      alert('Failed to add job')
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id?: string) => {
    if (!id) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/work/jobs?id=${id}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        await fetchJobs()
      } else {
        const error = await response.json()
        alert(`Failed to delete job: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Failed to delete job')
    } finally {
      setLoading(false)
    }
  }


  const addAssessment = async () => {
    if (!newAssessment.company || !newAssessment.type || !newAssessment.date) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/work/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssessment)
      })
      
      if (response.ok) {
        await fetchAssessments()
        setNewAssessment({ company: "", type: "", date: "" })
      } else {
        const error = await response.json()
        alert(`Failed to add assessment: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding assessment:', error)
      alert('Failed to add assessment')
    } finally {
      setLoading(false)
    }
  }

  const deleteAssessment = async (id?: string) => {
    if (!id) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/work/assessments?id=${id}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        await fetchAssessments()
      } else {
        const error = await response.json()
        alert(`Failed to delete assessment: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting assessment:', error)
      alert('Failed to delete assessment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        💼 Work Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
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
                    onClick={() => deleteJob(job._id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}


              <div className="space-y-2 border-t border-neutral-700 pt-3">
                <Input
                  placeholder="Company"
                  value={newJob.company}
                  className="bg-black border-neutral-700 text-white placeholder-gray-500"
                  onChange={(e) =>
                    setNewJob({ ...newJob, company: e.target.value })
                  }
                  disabled={loading}
                />
                <Input
                  placeholder="Role"
                  value={newJob.role}
                  className="bg-black border-neutral-700 text-white placeholder-gray-500"
                  onChange={(e) =>
                    setNewJob({ ...newJob, role: e.target.value })
                  }
                  disabled={loading}
                />
                <Select
                  value={newJob.status}
                  onValueChange={(value) =>
                    setNewJob({ ...newJob, status: value as JobStatus })
                  }
                  disabled={loading}
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
                  disabled={loading}
                >
                  <Plus size={16} className="mr-2" /> 
                  {loading ? 'Adding...' : 'Add Job'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>


        <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-700">
          <CardHeader>
            <CardTitle className="text-white">OA & Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessments.map((assessment) => (
                <div
                  key={assessment._id}
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
                    onClick={() => deleteAssessment(assessment._id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}


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
                  disabled={loading}
                />
                <Select
                  value={newAssessment.type}
                  onValueChange={(value) =>
                    setNewAssessment({
                      ...newAssessment,
                      type: value as AssessmentType,
                    })
                  }
                  disabled={loading}
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
                  className="bg-black border-neutral-700 text-white placeholder-gray-500"
                  onChange={(e) =>
                    setNewAssessment({
                      ...newAssessment,
                      date: e.target.value,
                    })
                  }
                  disabled={loading}
                />
                <Button
                  className="w-full bg-white text-black hover:bg-gray-300"
                  onClick={addAssessment}
                  disabled={loading}
                >
                  <Plus size={16} className="mr-2" /> 
                  {loading ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
