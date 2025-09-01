// "use client"
// // /pages/study.tsx
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar, Trash2, Plus } from "lucide-react";
// import { JSX } from "react/jsx-runtime";

// // Type definitions
// interface Grade {
//   subject: string;
//   grade: string;
//   credits: number;
// }

// interface Assignment {
//   subject: string;
//   desc: string;
//   due: string;
// }

// interface Exam {
//   subject: string;
//   date: string;
// }

// interface NewGradeForm {
//   subject: string;
//   grade: string;
//   credits: string;
// }

// interface NewAssignmentForm {
//   subject: string;
//   desc: string;
//   due: string;
// }

// interface NewExamForm {
//   subject: string;
//   date: string;
// }

// export default function Study(): JSX.Element {
//   // States
//   const [grades, setGrades] = useState<Grade[]>([
//     { subject: "Math", grade: "A", credits: 4 },
//   ]);

//   const [assignments, setAssignments] = useState<Assignment[]>([
//     { subject: "DSA", desc: "Leetcode Sheet 1-10", due: "2025-09-10" },
//   ]);

//   const [exams, setExams] = useState<Exam[]>([
//     { subject: "DBMS", date: "2025-09-20" },
//   ]);

//   // Form states
//   const [newGrade, setNewGrade] = useState<NewGradeForm>({ subject: "", grade: "", credits: "" });
//   const [newAssignment, setNewAssignment] = useState<NewAssignmentForm>({ subject: "", desc: "", due: "" });
//   const [newExam, setNewExam] = useState<NewExamForm>({ subject: "", date: "" });

//   // Handlers
//   const addGrade = (): void => {
//     if (!newGrade.subject || !newGrade.grade || !newGrade.credits) return;
//     setGrades([...grades, { ...newGrade, credits: Number(newGrade.credits) }]);
//     setNewGrade({ subject: "", grade: "", credits: "" });
//   };

//   const deleteGrade = (index: number): void => {
//     setGrades(grades.filter((_, idx) => idx !== index));
//   };

//   const addAssignment = (): void => {
//     if (!newAssignment.subject || !newAssignment.desc || !newAssignment.due) return;
//     setAssignments([...assignments, newAssignment]);
//     setNewAssignment({ subject: "", desc: "", due: "" });
//   };

//   const deleteAssignment = (index: number): void => {
//     setAssignments(assignments.filter((_, idx) => idx !== index));
//   };

//   const addExam = (): void => {
//     if (!newExam.subject || !newExam.date) return;
//     setExams([...exams, newExam]);
//     setNewExam({ subject: "", date: "" });
//   };

//   const deleteExam = (index: number): void => {
//     setExams(exams.filter((_, idx) => idx !== index));
//   };

//   return (
//     <div className="min-h-screen bg-[#1D1616] text-[#EEEEEE] p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center text-[#D84040]">
//         📘 Study Dashboard
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Grades */}
//         <Card className="bg-[#8E1616] text-[#EEEEEE] rounded-2xl shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-[#EEEEEE]">Grades</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-[#D84040]">
//                   <th className="text-left p-2">Subject</th>
//                   <th className="text-left p-2">Grade</th>
//                   <th className="text-left p-2">Credits</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {grades.map((grade, index) => (
//                   <tr key={index} className="border-t border-[#EEEEEE]/30">
//                     <td className="p-2">{grade.subject}</td>
//                     <td className="p-2">{grade.grade}</td>
//                     <td className="p-2">{grade.credits}</td>
//                     <td className="p-2">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => deleteGrade(index)}
//                       >
//                         <Trash2 className="text-[#D84040]" size={16} />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* Add Grade */}
//             <div className="flex gap-2 mt-3">
//               <Input
//                 placeholder="Subject"
//                 value={newGrade.subject}
//                 onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })}
//               />
//               <Input
//                 placeholder="Grade"
//                 value={newGrade.grade}
//                 onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
//               />
//               <Input
//                 placeholder="Credits"
//                 type="number"
//                 value={newGrade.credits}
//                 onChange={(e) => setNewGrade({ ...newGrade, credits: e.target.value })}
//               />
//               <Button className="bg-[#D84040] hover:bg-[#8E1616]" onClick={addGrade}>
//                 <Plus size={16} />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Assignments */}
//         <Card className="bg-[#8E1616] text-[#EEEEEE] rounded-2xl shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-[#EEEEEE]">Assignments</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {assignments.map((assignment, index) => (
//               <div
//                 key={index}
//                 className="p-2 mb-2 rounded-lg bg-[#1D1616]/60 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-medium">{assignment.subject}</p>
//                   <p className="text-sm text-[#EEEEEE]/70">{assignment.desc}</p>
//                   <span className="text-[#D84040]">{assignment.due}</span>
//                 </div>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => deleteAssignment(index)}
//                 >
//                   <Trash2 className="text-[#D84040]" size={16} />
//                 </Button>
//               </div>
//             ))}
//             {/* Add Assignment */}
//             <div className="flex flex-col gap-2 mt-3">
//               <Input
//                 placeholder="Subject"
//                 value={newAssignment.subject}
//                 onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
//               />
//               <Input
//                 placeholder="Description"
//                 value={newAssignment.desc}
//                 onChange={(e) => setNewAssignment({ ...newAssignment, desc: e.target.value })}
//               />
//               <Input
//                 placeholder="Due Date (YYYY-MM-DD)"
//                 type="date"
//                 value={newAssignment.due}
//                 onChange={(e) => setNewAssignment({ ...newAssignment, due: e.target.value })}
//               />
//               <Button className="bg-[#D84040] hover:bg-[#8E1616]" onClick={addAssignment}>
//                 <Plus size={16} /> Add
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Exams */}
//         <Card className="bg-[#8E1616] text-[#EEEEEE] rounded-2xl shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-[#EEEEEE]">Exams</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {exams.map((exam, index) => (
//               <div
//                 key={index}
//                 className="p-2 mb-2 rounded-lg bg-[#1D1616]/60 flex justify-between items-center"
//               >
//                 <p>{exam.subject}</p>
//                 <span className="flex items-center gap-1 text-[#D84040]">
//                   <Calendar size={16} /> {exam.date}
//                 </span>
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => deleteExam(index)}
//                 >
//                   <Trash2 className="text-[#D84040]" size={16} />
//                 </Button>
//               </div>
//             ))}
//             {/* Add Exam */}
//             <div className="flex gap-2 mt-3">
//               <Input
//                 placeholder="Subject"
//                 value={newExam.subject}
//                 onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
//               />
//               <Input
//                 placeholder="Date"
//                 type="date"
//                 value={newExam.date}
//                 onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
//               />
//               <Button className="bg-[#D84040] hover:bg-[#8E1616]" onClick={addExam}>
//                 <Plus size={16} />
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client"
// /pages/study.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Trash2, Plus } from "lucide-react";
import { JSX } from "react/jsx-runtime";

// Type definitions
interface Grade {
  subject: string;
  grade: string;
  credits: number;
}
interface Assignment {
  subject: string;
  desc: string;
  due: string;
}
interface Exam {
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
  // States
  const [grades, setGrades] = useState<Grade[]>([{ subject: "Math", grade: "A", credits: 4 }]);
  const [assignments, setAssignments] = useState<Assignment[]>([
    { subject: "DSA", desc: "Leetcode Sheet 1-10", due: "2025-09-10" },
  ]);
  const [exams, setExams] = useState<Exam[]>([{ subject: "DBMS", date: "2025-09-20" }]);

  // Form states
  const [newGrade, setNewGrade] = useState<NewGradeForm>({ subject: "", grade: "", credits: "" });
  const [newAssignment, setNewAssignment] = useState<NewAssignmentForm>({
    subject: "",
    desc: "",
    due: "",
  });
  const [newExam, setNewExam] = useState<NewExamForm>({ subject: "", date: "" });

  // Handlers
  const addGrade = (): void => {
    if (!newGrade.subject || !newGrade.grade || !newGrade.credits) return;
    setGrades([...grades, { ...newGrade, credits: Number(newGrade.credits) }]);
    setNewGrade({ subject: "", grade: "", credits: "" });
  };
  const deleteGrade = (index: number): void => {
    setGrades(grades.filter((_, idx) => idx !== index));
  };
  const addAssignment = (): void => {
    if (!newAssignment.subject || !newAssignment.desc || !newAssignment.due) return;
    setAssignments([...assignments, newAssignment]);
    setNewAssignment({ subject: "", desc: "", due: "" });
  };
  const deleteAssignment = (index: number): void => {
    setAssignments(assignments.filter((_, idx) => idx !== index));
  };
  const addExam = (): void => {
    if (!newExam.subject || !newExam.date) return;
    setExams([...exams, newExam]);
    setNewExam({ subject: "", date: "" });
  };
  const deleteExam = (index: number): void => {
    setExams(exams.filter((_, idx) => idx !== index));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        📘 Study Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grades */}
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="p-2">{grade.subject}</td>
                    <td className="p-2">{grade.grade}</td>
                    <td className="p-2">{grade.credits}</td>
                    <td className="p-2">
                      <Button size="icon" variant="ghost" onClick={() => deleteGrade(index)}>
                        <Trash2 className="text-white" size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Add Grade */}
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Subject"
                className="bg-black border border-gray-700 text-white"
                value={newGrade.subject}
                onChange={(e) => setNewGrade({ ...newGrade, subject: e.target.value })}
              />
              <Input
                placeholder="Grade"
                className="bg-black border border-gray-700 text-white"
                value={newGrade.grade}
                onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
              />
              <Input
                placeholder="Credits"
                type="number"
                className="bg-black border border-gray-700 text-white"
                value={newGrade.credits}
                onChange={(e) => setNewGrade({ ...newGrade, credits: e.target.value })}
              />
              <Button className="bg-white text-black hover:bg-gray-300" onClick={addGrade}>
                <Plus size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card className="bg-[#111111] text-white rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.map((assignment, index) => (
              <div
                key={index}
                className="p-2 mb-2 rounded-lg bg-black/60 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{assignment.subject}</p>
                  <p className="text-sm text-gray-400">{assignment.desc}</p>
                  <span className="text-gray-300">{assignment.due}</span>
                </div>
                <Button size="icon" variant="ghost" onClick={() => deleteAssignment(index)}>
                  <Trash2 className="text-white" size={16} />
                </Button>
              </div>
            ))}
            {/* Add Assignment */}
            <div className="flex flex-col gap-2 mt-3">
              <Input
                placeholder="Subject"
                className="bg-black border border-gray-700 text-white"
                value={newAssignment.subject}
                onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
              />
              <Input
                placeholder="Description"
                className="bg-black border border-gray-700 text-white"
                value={newAssignment.desc}
                onChange={(e) => setNewAssignment({ ...newAssignment, desc: e.target.value })}
              />
              <Input
                placeholder="Due Date (YYYY-MM-DD)"
                type="date"
                className="bg-black border border-gray-700 text-white"
                value={newAssignment.due}
                onChange={(e) => setNewAssignment({ ...newAssignment, due: e.target.value })}
              />
              <Button className="bg-white text-black hover:bg-gray-300" onClick={addAssignment}>
                <Plus size={16} /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exams */}
        <Card className="bg-[#111111] text-white rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Exams</CardTitle>
          </CardHeader>
          <CardContent>
            {exams.map((exam, index) => (
              <div
                key={index}
                className="p-2 mb-2 rounded-lg bg-black/60 flex justify-between items-center"
              >
                <p>{exam.subject}</p>
                <span className="flex items-center gap-1 text-gray-300">
                  <Calendar size={16} /> {exam.date}
                </span>
                <Button size="icon" variant="ghost" onClick={() => deleteExam(index)}>
                  <Trash2 className="text-white" size={16} />
                </Button>
              </div>
            ))}
            {/* Add Exam */}
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Subject"
                className="bg-black border border-gray-700 text-white"
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              />
              <Input
                placeholder="Date"
                type="date"
                className="bg-black border border-gray-700 text-white"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
              />
              <Button className="bg-white text-black hover:bg-gray-300" onClick={addExam}>
                <Plus size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
