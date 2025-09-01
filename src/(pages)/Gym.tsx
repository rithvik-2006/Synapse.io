
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
import Navbar from "@/(components)/navbar"


interface WorkoutRoutine {
  name: string
  exercises: string
}

interface WeightEntry {
  date: string
  weight: number
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
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([
    { name: "Push Day", exercises: "Bench, Shoulder Press, Triceps" },
  ])
  const [newRoutine, setNewRoutine] = useState<NewRoutineForm>({
    name: "",
    exercises: "",
  })

  const [weightLog, setWeightLog] = useState<WeightEntry[]>([
    { date: "2025-09-01", weight: 70 },
    { date: "2025-09-05", weight: 71 },
    { date: "2025-09-10", weight: 69.5 },
  ])
  const [newWeight, setNewWeight] = useState<NewWeightForm>({
    date: "",
    weight: "",
  })

  const [height, setHeight] = useState<number>(175) // in cm
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])


  const bmiData: BMIDataPoint[] = weightLog.map((entry) => {
    const heightInMeters = height / 100
    const bmi = Number(
      (entry.weight / (heightInMeters * heightInMeters)).toFixed(1),
    )
    return { ...entry, bmi }
  })


  const addRoutine = (): void => {
    if (!newRoutine.name.trim() || !newRoutine.exercises.trim()) return
    setRoutines([...routines, { ...newRoutine }])
    setNewRoutine({ name: "", exercises: "" })
  }

  const deleteRoutine = (index: number): void => {
    setRoutines(routines.filter((_, idx) => idx !== index))
  }

  const addWeight = (): void => {
    if (!newWeight.date.trim() || !newWeight.weight.trim()) return
    
    const weightValue = parseFloat(newWeight.weight)
    if (isNaN(weightValue) || weightValue <= 0) return
    
    const weightEntry: WeightEntry = {
      date: newWeight.date,
      weight: weightValue,
    }
    

    const newWeightLog = [...weightLog, weightEntry].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    setWeightLog(newWeightLog)
    setNewWeight({ date: "", weight: "" })
  }

  const deleteWeight = (index: number): void => {
    setWeightLog(weightLog.filter((_, idx) => idx !== index))
  }

  const handleHeightChange = (value: string): void => {
    const numericValue = parseFloat(value)
    if (!isNaN(numericValue) && numericValue > 0) {
      setHeight(numericValue)
    }
  }

  const calculateBMI = (weight: number, heightInCm: number): number => {
    const heightInMeters = heightInCm / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }


  const getTodayDate = (): string => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <>
    <Navbar/>
    <div className="p-6 bg-black text-white min-h-screen">
        
      <h1 className="text-3xl font-bold mb-8 text-center">🏋️ Gym Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">Workout Routine</CardTitle>
          </CardHeader>
          <CardContent>
            {routines.map((routine, index) => (
              <div
                key={index}
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
                  onClick={() => deleteRoutine(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}


            <div className="space-y-2 border-t border-neutral-800 pt-3">
              <Input
                className="bg-neutral-950 border-neutral-800 text-white placeholder-gray-500"
                placeholder="Routine Name (e.g. Push Day)"
                value={newRoutine.name}
                onChange={(e) =>
                  setNewRoutine({ ...newRoutine, name: e.target.value })
                }
              />
              <Input
                className="bg-neutral-950 border-neutral-800 text-white placeholder-gray-500"
                placeholder="Exercises (comma separated)"
                value={newRoutine.exercises}
                onChange={(e) =>
                  setNewRoutine({ ...newRoutine, exercises: e.target.value })
                }
              />
              <Button
                className="w-full bg-white text-black hover:bg-gray-300"
                onClick={addRoutine}
              >
                <Plus size={16} className="mr-2" /> Add Routine
              </Button>
            </div>
          </CardContent>
        </Card>


        <Card className="rounded-2xl shadow-lg bg-neutral-900 border border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">Weight & BMI Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            {weightLog.map((weightEntry, index) => (
              <div
                key={index}
                className="p-3 mb-3 rounded-lg border text-white border-neutral-800 bg-neutral-800 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{weightEntry.date}</p>
                  <p className="text-sm text-gray-400">
                    Weight: {weightEntry.weight} kg
                  </p>
                  <p className="text-gray-200">
                    BMI: {calculateBMI(weightEntry.weight, height)}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteWeight(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}


            <div className="space-y-2 border-t text-white border-neutral-800 pt-3">
            <Input
  type="date"
  className="bg-neutral-950 border-neutral-800 text-white placeholder-gray-500 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
  value={newWeight.date}
  onChange={(e) =>
    setNewWeight({ ...newWeight, date: e.target.value })
  }
  max={getTodayDate()}
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
              />
              <Button
                className="w-full bg-white text-black hover:bg-gray-300"
                onClick={addWeight}
                disabled={!newWeight.date || !newWeight.weight}
              >
                <Plus size={16} className="mr-2" /> Add Entry
              </Button>
            </div>


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
              />
            </div>


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