
"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Trash2, Plus, Calculator } from "lucide-react";
import { JSX } from "react/jsx-runtime";


const gradePointMap: { [key: string]: number } = {
  'A+': 10,
  'A': 10,
  'A-': 9,
  'B': 8,
  'B-': 7,
  'C': 6,
  'C-': 5,
  'D': 4,
  'P':2,
  'F': 0,
  'AU': 0,
  'U': 0,
};


interface Grade {
  _id?: string;
  subject: string;
  grade: string;
  credits: number;
}
interface Assignment {
  _id?: string;
  subject: string;
  desc: string;
  due: string;
}
interface Exam {
  _id?: string;
  subject: string;
  date: string;
}
interface NewGradeForm {
  subject: string;
  grade: string;
  credits: string;
}
interface NewAssignmentForm {
  subject: string;
  desc: string;
  due: string;
}
interface NewExamForm {
  subject: string;
  date: string;
}

export default function Study(): JSX.Element {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);

  const [newGrade, setNewGrade] = useState<NewGradeForm>({ subject: "", grade: "", credits: "" });
  const [newAssignment, setNewAssignment] = useState<NewAssignmentForm>({ subject: "", desc: "", due: "" });
  const [newExam, setNewExam] = useState<NewExamForm>({ subject: "", date: "" });


  const calculateCGPA = (): { cgpa: number; totalCredits: number; totalGradePoints: number } => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    grades.forEach((grade) => {
      const gradePoint = gradePointMap[grade.grade.toUpperCase()] || 0;
      totalGradePoints += gradePoint * grade.credits;
      totalCredits += grade.credits;
    });

    const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    
    return {
      cgpa: parseFloat(cgpa.toFixed(2)),
      totalCredits,
      totalGradePoints
    };
  };

  const { cgpa, totalCredits, totalGradePoints } = calculateCGPA();


  const fetchGrades = async () => {
    try {
      const res = await fetch('/api/study/grades');
      if (res.ok) {
        const data = await res.json();
        setGrades(data.data || []);
      } else {
        console.error('Failed to fetch grades');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };


  const fetchAssignments = async () => {
    try {
      const res = await fetch('/api/study/assignments');
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.data || []);
      } else {
        console.error('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };


  const fetchExams = async () => {
    try {
      const res = await fetch('/api/study/exams');
      if (res.ok) {
        const data = await res.json();
        setExams(data.data || []);
      } else {
        console.error('Failed to fetch exams');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };


  useEffect(() => {
    fetchGrades();
    fetchAssignments();
    fetchExams();
  }, []);


  const addGrade = async (): Promise<void> => {
    if (!newGrade.subject || !newGrade.grade || !newGrade.credits) return;

    setLoading(true);
    try {
      const res = await fetch('/api/study/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGrade,
          credits: Number(newGrade.credits),
        }),
      });

      if (res.ok) {
        await fetchGrades();
        setNewGrade({ subject: '', grade: '', credits: '' });
      } else {
        const error = await res.json();
        alert(`Failed to add grade: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding grade:', error);
      alert('Failed to add grade');
    } finally {
      setLoading(false);
    }
  };

  const deleteGrade = async (id?: string): Promise<void> => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/study/grades?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchGrades();
      } else {
        const error = await res.json();
        alert(`Failed to delete grade: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting grade:', error);
      alert('Failed to delete grade');
    } finally {
      setLoading(false);
    }
  };


  const addAssignment = async (): Promise<void> => {
    if (!newAssignment.subject || !newAssignment.desc || !newAssignment.due) return;

    setLoading(true);
    try {
      const res = await fetch('/api/study/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment),
      });

      if (res.ok) {
        await fetchAssignments();
        setNewAssignment({ subject: '', desc: '', due: '' });
      } else {
        const error = await res.json();
        alert(`Failed to add assignment: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding assignment:', error);
      alert('Failed to add assignment');
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id?: string): Promise<void> => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/study/assignments?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchAssignments();
      } else {
        const error = await res.json();
        alert(`Failed to delete assignment: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };


  const addExam = async (): Promise<void> => {
    if (!newExam.subject || !newExam.date) return;

    setLoading(true);
    try {
      const res = await fetch('/api/study/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExam),
      });

      if (res.ok) {
        await fetchExams();
        setNewExam({ subject: '', date: '' });
      } else {
        const error = await res.json();
        alert(`Failed to add exam: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding exam:', error);
      alert('Failed to add exam');
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id?: string): Promise<void> => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/study/exams?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchExams();
      } else {
        const error = await res.json();
        alert(`Failed to delete exam: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        📘 Study Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="bg-[#111111] text-white rounded-2xl shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator size={20} />
              CGPA Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-black/60 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-400 mb-1">Current CGPA</h3>
                <p className="text-3xl font-bold text-green-400">{cgpa}</p>
              </div>
              <div className="bg-black/60 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-400 mb-1">Total Credits</h3>
                <p className="text-2xl font-semibold text-blue-400">{totalCredits}</p>
              </div>
              <div className="bg-black/60 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-400 mb-1">Total Grade Points</h3>
                <p className="text-2xl font-semibold text-yellow-400">{totalGradePoints}</p>
              </div>
              <div className="bg-black/60 p-4 rounded-lg text-center">
                <h3 className="text-sm text-gray-400 mb-1">Subjects</h3>
                <p className="text-2xl font-semibold text-purple-400">{grades.length}</p>
              </div>
            </div>
            

            <div className="mt-4 p-3 bg-black/40 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 text-gray-300">Grade Point Reference:</h4>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-xs">
                {Object.entries(gradePointMap).map(([grade, point]) => (
                  <div key={grade} className="text-center">
                    <span className="text-gray-400">{grade}</span>
                    <span className="text-white ml-1">({point})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>


        <Card className="bg-[#111111] text-white rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-300">
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Grade</th>
                  <th className="text-left p-2">Credits</th>
                  <th className="text-left p-2">Points</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => {
                  const gradePoint = gradePointMap[grade.grade.toUpperCase()] || 0;
                  const totalPoints = gradePoint * grade.credits;
                  
                  return (
                    <tr key={grade._id} className="border-t border-gray-700">
                      <td className="p-2">{grade.subject}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          gradePoint >= 9 ? 'bg-green-600' :
                          gradePoint >= 7 ? 'bg-blue-600' :
                          gradePoint >= 5 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="p-2">{grade.credits}</td>
                      <td className="p-2 text-gray-300">{totalPoints}</td>
                      <td className="p-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => deleteGrade(grade._id)}
                          disabled={loading}
                        >
                          <Trash2 className="text-white" size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Subject"
                className="bg-black border border-gray-700 text-white"
                value={newGrade.subject}
                onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })}
                disabled={loading}
              />
              <select
                className="bg-black border border-gray-700 text-white rounded px-3 py-2 text-sm"
                value={newGrade.grade}
                onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
                disabled={loading}
              >
                <option value="">Grade</option>
                {Object.keys(gradePointMap).map((grade) => (
                  <option key={grade} value={grade}>
                    {grade} ({gradePointMap[grade]})
                  </option>
                ))}
              </select>
              <Input
                placeholder="Credits"
                type="number"
                className="bg-black border border-gray-700 text-white"
                value={newGrade.credits}
                onChange={(e) => setNewGrade({ ...newGrade, credits: e.target.value })}
                disabled={loading}
              />
              <Button 
                className="bg-white text-black hover:bg-gray-300" 
                onClick={addGrade}
                disabled={loading}
              >
                <Plus size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>


        <Card className="bg-[#111111] text-white rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="p-2 mb-2 rounded-lg bg-black/60 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{assignment.subject}</p>
                  <p className="text-sm text-gray-400">{assignment.desc}</p>
                  <span className="text-gray-300">{assignment.due}</span>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => deleteAssignment(assignment._id)}
                  disabled={loading}
                >
                  <Trash2 className="text-white" size={16} />
                </Button>
              </div>
            ))}

            <div className="flex flex-col gap-2 mt-3">
              <Input
                placeholder="Subject"
                className="bg-black border border-gray-700 text-white"
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                disabled={loading}
              />
              <Input
                placeholder="Description"
                className="bg-black border border-gray-700 text-white"
                value={newAssignment.desc}
                onChange={(e) => setNewAssignment({ ...newAssignment, desc: e.target.value })}
                disabled={loading}
              />
              <Input
                placeholder="Due Date (YYYY-MM-DD)"
                type="date"
                className="bg-black border border-gray-700 text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                value={newAssignment.due}
                onChange={(e) => setNewAssignment({ ...newAssignment, due: e.target.value })}
                disabled={loading}
                />

              <Button 
                className="bg-white text-black hover:bg-gray-300" 
                onClick={addAssignment}
                disabled={loading}
              >
                <Plus size={16} /> {loading ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </CardContent>
        </Card>


        <Card className="bg-[#111111] text-white rounded-2xl shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle>Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exams.map((exam) => (
                <div
                  key={exam._id}
                  className="p-3 rounded-lg bg-black/60 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{exam.subject}</p>
                    <span className="flex items-center gap-1 text-gray-300">
                      <Calendar size={16} /> {exam.date}
                    </span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => deleteExam(exam._id)}
                    disabled={loading}
                  >
                    <Trash2 className="text-white" size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Subject"
                className="bg-black border border-gray-700 text-white"
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                disabled={loading}
              />
              <Input
                placeholder="Date"
                type="date"
                className="bg-black border border-gray-700 text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                disabled={loading}
                />

              <Button 
                className="bg-white text-black hover:bg-gray-300" 
                onClick={addExam}
                disabled={loading}
              >
                <Plus size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
