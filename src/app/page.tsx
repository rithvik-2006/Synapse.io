
"use client"
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BookOpen, Calendar, Briefcase, Clock } from "lucide-react";

interface Grade {
  subject: string;
  grade: string;
  credits: number;
}

interface Assignment {
  _id: string;
  subject: string;
  desc: string;
  due: string;
}

interface Exam {
  _id: string;
  subject: string;
  date: string;
}

interface Assessment {
  _id: string;
  company: string;
  type: string;
  date: string;
}

const gradePointMap: { [key: string]: number } = {
  'A+': 10,
  'A': 10,
  'A-': 9,
  'B+': 8,
  'B': 7,
  'B-': 6,
  'C+': 5,
  'C': 4,
  'C-': 0,
  'D': 0,
  'F': 0,
  'AU': 0,
  'U': 0,
  'P': 0,
  'S': 10
};

export default function Home() {
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toISOString().slice(0, 10);

  const fetchGradesAndCalculateCGPA = useCallback(async () => {
    try {
      const res = await fetch('/api/study/grades');
      if (res.ok) {
        const data = await res.json();
        const grades: Grade[] = data.data || [];

        let totalGradePoints = 0;
        let credits = 0;

        grades.forEach((grade) => {
          const gradePoint = gradePointMap[grade.grade.toUpperCase()] || 0;
          totalGradePoints += gradePoint * grade.credits;
          credits += grade.credits;
        });

        const calculatedCgpa = credits > 0 ? totalGradePoints / credits : 0;
        setCgpa(parseFloat(calculatedCgpa.toFixed(2)));
        setTotalCredits(credits);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  }, []);

  const fetchUpcomingAssignments = useCallback(async () => {
    try {
      const res = await fetch('/api/study/assignments');
      if (res.ok) {
        const data = await res.json();
        const allAssignments: Assignment[] = data.data || [];
        
        const upcomingAssignments = allAssignments
          .filter(assignment => assignment.due >= currentDate)
          .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
          .slice(0, 5);
        
        setAssignments(upcomingAssignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  }, [currentDate]);

  const fetchUpcomingExams = useCallback(async () => {
    try {
      const res = await fetch('/api/study/exams');
      if (res.ok) {
        const data = await res.json();
        const allExams: Exam[] = data.data || [];
        
        const upcomingExams = allExams
          .filter(exam => exam.date >= currentDate)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);
        
        setExams(upcomingExams);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  }, [currentDate]);

  const fetchUpcomingAssessments = useCallback(async () => {
    try {
      const res = await fetch('/api/work/assessments');
      if (res.ok) {
        const data = await res.json();
        const allAssessments: Assessment[] = data.data || [];
        
        const upcomingAssessments = allAssessments
          .filter(assessment => assessment.date >= currentDate)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5);
        
        setAssessments(upcomingAssessments);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  }, [currentDate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === today.toISOString().slice(0, 10)) {
      return "Today";
    } else if (dateString === tomorrow.toISOString().slice(0, 10)) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchGradesAndCalculateCGPA(),
        fetchUpcomingAssignments(),
        fetchUpcomingExams(),
        fetchUpcomingAssessments()
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchGradesAndCalculateCGPA, fetchUpcomingAssignments, fetchUpcomingExams, fetchUpcomingAssessments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r text-white bg-clip-text text-transparent">
        Welcome to Your Dashboard
      </h1>

      <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30 rounded-2xl shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator size={24} />
            Academic Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-6xl font-bold text-green-400 mb-2">
                {cgpa !== null ? cgpa : "N/A"}
              </p>
              <p className="text-lg text-gray-300">Current CGPA</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-blue-400 mb-1">
                {totalCredits}
              </p>
              <p className="text-sm text-gray-400">Total Credits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#111111] border-orange-500/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <BookOpen size={20} />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment) => {
                  const daysUntil = getDaysUntil(assignment.due);
                  return (
                    <div
                      key={assignment._id}
                      className={`p-3 rounded-lg border-l-4 ${
                        daysUntil <= 1 ? 'border-red-500 bg-red-900/20' :
                        daysUntil <= 3 ? 'border-yellow-500 bg-yellow-900/20' :
                        'border-green-500 bg-green-900/20'
                      }`}
                    >
                      <p className="font-semibold text-white">{assignment.subject}</p>
                      <p className="text-sm text-gray-400 truncate">{assignment.desc}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-300">
                          {formatDate(assignment.due)} ({daysUntil} days)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No upcoming assignments</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-blue-500/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Calendar size={20} />
              Upcoming Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exams.length > 0 ? (
              <div className="space-y-3">
                {exams.map((exam) => {
                  const daysUntil = getDaysUntil(exam.date);
                  return (
                    <div
                      key={exam._id}
                      className={`p-3 rounded-lg border-l-4 ${
                        daysUntil <= 1 ? 'border-red-500 bg-red-900/20' :
                        daysUntil <= 7 ? 'border-yellow-500 bg-yellow-900/20' :
                        'border-blue-500 bg-blue-900/20'
                      }`}
                    >
                      <p className="font-semibold text-white">{exam.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-300">
                          {formatDate(exam.date)} ({daysUntil} days)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No upcoming exams</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-purple-500/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Briefcase size={20} />
              Upcoming Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length > 0 ? (
              <div className="space-y-3">
                {assessments.map((assessment) => {
                  const daysUntil = getDaysUntil(assessment.date);
                  return (
                    <div
                      key={assessment._id}
                      className={`p-3 rounded-lg border-l-4 ${
                        daysUntil <= 1 ? 'border-red-500 bg-red-900/20' :
                        daysUntil <= 3 ? 'border-yellow-500 bg-yellow-900/20' :
                        'border-purple-500 bg-purple-900/20'
                      }`}
                    >
                      <p className="font-semibold text-white">{assessment.company}</p>
                      <p className="text-sm text-gray-400">{assessment.type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={14} className="text-gray-500" />
                        <span className="text-xs text-gray-300">
                          {formatDate(assessment.date)} ({daysUntil} days)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No upcoming assessments</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}