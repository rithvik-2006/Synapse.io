
"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Dumbbell } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"


// Type definitions
interface WorkoutRoutine {
  _id?: string
  name: string
  exercises: string
}

interface WeightEntry {
  _id?: string
  date: string
  weight: number
  bmi?: number
}

interface BMIDataPoint extends WeightEntry {
  bmi: number
}

interface NewRoutineForm {
  name: string
  exercises: string
}

interface NewWeightForm {
  date: string
  weight: string
}

export default function Gym() {
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([])
  const [newRoutine, setNewRoutine] = useState<NewRoutineForm>({
    name: "",
    exercises: "",
  })
  
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([])
  const [newWeight, setNewWeight] = useState<NewWeightForm>({
    date: "",
    weight: "",
  })
  
  const [height, setHeight] = useState<number>(175) // Default height in cm
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch routines from backend
  const fetchRoutines = async () => {
    try {
      const res = await fetch('/api/fitness/routines')
      if (res.ok) {
        const data = await res.json()
        setRoutines(data.data || [])
      } else {
        console.error('Failed to fetch routines')
      }
    } catch (error) {
      console.error('Error fetching routines:', error)
    }
  }

  // Fetch weight logs from backend
  const fetchWeightLogs = async () => {
    try {
      const res = await fetch('/api/fitness/weight')
      if (res.ok) {
        const data = await res.json()
        setWeightLog(data.data || [])
      } else {
        console.error('Failed to fetch weight logs')
      }
    } catch (error) {
      console.error('Error fetching weight logs:', error)
    }
  }

  // Fetch user profile (height) from backend
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/fitness/profile')
      if (res.ok) {
        const data = await res.json()
        setHeight(data.data?.height || 175)
      } else {
        console.error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Save height to backend
  const saveHeight = async (newHeight: number) => {
    try {
      const res = await fetch('/api/fitness/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ height: newHeight })
      })
      
      if (!res.ok) {
        console.error('Failed to save height')
      }
    } catch (error) {
      console.error('Error saving height:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchRoutines(),
        fetchWeightLogs(),
        fetchProfile()
      ])
      setMounted(true)
    }
    loadData()
  }, [])

  // Calculate BMI data for chart
  const bmiData: BMIDataPoint[] = weightLog.map((entry) => {
    const heightInMeters = height / 100
    const bmi = Number(
      (entry.weight / (heightInMeters * heightInMeters)).toFixed(1),
    )
    return { ...entry, bmi }
  })

  // Routine handlers
  const addRoutine = async (): Promise<void> => {
    if (!newRoutine.name.trim() || !newRoutine.exercises.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/fitness/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoutine)
      })
      
      if (res.ok) {
        await fetchRoutines()
        setNewRoutine({ name: "", exercises: "" })
      } else {
        const error = await res.json()
        alert(`Failed to add routine: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding routine:', error)
      alert('Failed to add routine')
    } finally {
      setLoading(false)
    }
  }

  const deleteRoutine = async (id?: string): Promise<void> => {
    if (!id) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/fitness/routines?id=${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        await fetchRoutines()
      } else {
        const error = await res.json()
        alert(`Failed to delete routine: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting routine:', error)
      alert('Failed to delete routine')
    } finally {
      setLoading(false)
    }
  }

  // Weight handlers
  const addWeight = async (): Promise<void> => {
    if (!newWeight.date.trim() || !newWeight.weight.trim()) return
    
    const weightValue = parseFloat(newWeight.weight)
    if (isNaN(weightValue) || weightValue <= 0) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/fitness/weight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newWeight.date,
          weight: weightValue
        })
      })
      
      if (res.ok) {
        await fetchWeightLogs()
        setNewWeight({ date: "", weight: "" })
      } else {
        const error = await res.json()
        alert(`Failed to add weight entry: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding weight:', error)
      alert('Failed to add weight entry')
    } finally {
      setLoading(false)
    }
  }

  const deleteWeight = async (id?: string): Promise<void> => {
    if (!id) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/fitness/weight?id=${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        await fetchWeightLogs()
      } else {
        const error = await res.json()
        alert(`Failed to delete weight entry: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting weight:', error)
      alert('Failed to delete weight entry')
    } finally {
      setLoading(false)
    }
  }

  const handleHeightChange = async (value: string): Promise<void> => {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue) && numericValue > 0) {
      setHeight(numericValue)
      await saveHeight(numericValue)
    }
  }

  const calculateBMI = (weight: number, heightInCm: number): number => {
    const heightInMeters = heightInCm / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  // Get today's date in YYYY-MM-DD format for default date input
  const getTodayDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <>
      <div className="p-6 bg-black text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-center">🏋️ Gym Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Workout Routine */}
          <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg text-white font-semibold">Workout Routine</CardTitle>
            </CardHeader>
            <CardContent>
              {routines.map((routine) => (
                <div
                  key={routine._id}
                  className="p-3 mb-3 rounded-lg border border-neutral-800 text-white bg-neutral-800 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <Dumbbell size={16} />
                      {routine.name}
                    </p>
                    <p className="text-sm text-gray-400">{routine.exercises}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteRoutine(routine._id)}
                    className="text-gray-400 hover:text-red-500"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {/* Add Routine */}
              <div className="space-y-2 border-t border-neutral-800 pt-3">
                <Input
                  className="bg-neutral-950 border-neutral-800 text-white placeholder-gray-500"
                  placeholder="Routine Name (e.g. Push Day)"
                  value={newRoutine.name}
                  onChange={(e) =>
                    setNewRoutine({ ...newRoutine, name: e.target.value })
                  }
                  disabled={loading}
                />
                <Input
                  className="bg-neutral-950 border-neutral-800 text-white placeholder-gray-500"
                  placeholder="Exercises (comma separated)"
                  value={newRoutine.exercises}
                  onChange={(e) =>
                    setNewRoutine({ ...newRoutine, exercises: e.target.value })
                  }
                  disabled={loading}
                />
                <Button
                  className="w-full bg-white text-black hover:bg-gray-300"
                  onClick={addRoutine}
                  disabled={loading}
                >
                  <Plus size={16} className="mr-2" /> 
                  {loading ? 'Adding...' : 'Add Routine'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weight & BMI Tracker */}
          <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg text-white font-semibold">Weight & BMI Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              {weightLog.map((weightEntry) => (
                <div
                  key={weightEntry._id}
                  className="p-3 mb-3 rounded-lg border text-white border-neutral-800 bg-neutral-800 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{weightEntry.date}</p>
                    <p className="text-sm text-gray-400">
                      Weight: {weightEntry.weight} kg
                    </p>
                    <p className="text-gray-200">
                      BMI: {weightEntry.bmi || calculateBMI(weightEntry.weight, height)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteWeight(weightEntry._id)}
                    className="text-gray-400 hover:text-red-500"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              {/* Add Weight */}
              <div className="space-y-2 border-t text-white border-neutral-800 pt-3">
                <Input
                  type="date"
                  className="bg-neutral-950 border-neutral-800 text-white placeholder-gray-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  value={newWeight.date}
                  onChange={(e) =>
                    setNewWeight({ ...newWeight, date: e.target.value })
                  }
                  max={getTodayDate()}
                  disabled={loading}
                />
                <Input
                  placeholder="Weight (kg)"
                  type="number"
                  step="0.1"
                  min="1"
                  max="500"
                  className="bg-neutral-950 border-neutral-800 text-white placeholder-gray-500"
                  value={newWeight.weight}
                  onChange={(e) =>
                    setNewWeight({ ...newWeight, weight: e.target.value })
                  }
                  disabled={loading}
                />
                <Button
                  className="w-full bg-white text-black hover:bg-gray-300"
                  onClick={addWeight}
                  disabled={!newWeight.date || !newWeight.weight || loading}
                >
                  <Plus size={16} className="mr-2" /> 
                  {loading ? 'Adding...' : 'Add Entry'}
                </Button>
              </div>

              {/* Height Input */}
              <div className="flex items-center text-white gap-2 mt-4">
                <p className="text-sm">Height (cm):</p>
                <Input
                  type="number"
                  min="100"
                  max="250"
                  step="0.1"
                  value={height}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-24 bg-neutral-950 border-neutral-800 text-white"
                  disabled={loading}
                />
              </div>

              {/* BMI Graph */}
              <div className="mt-6 h-64 w-full">
                {mounted && bmiData.length > 0 && (
                  <div className="w-full h-full">
                    <h3 className="text-sm text-gray-400 mb-2">BMI Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={bmiData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#fff"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#fff"
                          fontSize={12}
                          domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#1a1a1a", 
                            color: "#fff",
                            border: "1px solid #404040",
                            borderRadius: "8px"
                          }}
                          labelStyle={{ color: "#fff" }}
                          formatter={(value: number) => [`${value}`, "BMI"]}
                          labelFormatter={(label: string) => `Date: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="bmi" 
                          stroke="#fff" 
                          strokeWidth={2}
                          dot={{ fill: "#fff", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {mounted && bmiData.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No weight data to display
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
