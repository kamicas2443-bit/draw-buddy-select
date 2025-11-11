import { useState, useEffect } from 'react';
import { Student, DrawHistory } from '@/types/student';

const STORAGE_KEY = 'students_data';
const HISTORY_KEY = 'draw_history';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<DrawHistory[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved).map((h: any) => ({
      ...h,
      date: new Date(h.date)
    })) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addStudent = (name: string) => {
    const newStudent: Student = {
      id: crypto.randomUUID(),
      name: name.trim(),
      timesDrawn: 0,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const updateStudent = (id: string, name: string) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, name: name.trim() } : s
    ));
  };

  const drawStudents = (count: number = 3): Student[] => {
    if (students.length < count) return [];
    
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, count);
    
    const updatedStudents = students.map(student => {
      if (drawn.find(d => d.id === student.id)) {
        return {
          ...student,
          timesDrawn: student.timesDrawn + 1,
          lastDrawn: new Date()
        };
      }
      return student;
    });
    
    setStudents(updatedStudents);
    
    const historyEntry: DrawHistory = {
      id: crypto.randomUUID(),
      students: drawn,
      date: new Date()
    };
    setHistory(prev => [historyEntry, ...prev].slice(0, 50));
    
    return drawn;
  };

  const importStudents = (data: Student[]) => {
    setStudents(data);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    students,
    history,
    addStudent,
    removeStudent,
    updateStudent,
    drawStudents,
    importStudents,
    clearHistory
  };
};
