import { useState, useEffect } from 'react';
import { Student, DrawHistory } from '@/types/student';

const STORAGE_KEY = 'students_data';
const HISTORY_KEY = 'draw_history';
const POOL_KEY = 'available_pool';

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

  const [availablePool, setAvailablePool] = useState<string[]>(() => {
    const saved = localStorage.getItem(POOL_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(POOL_KEY, JSON.stringify(availablePool));
  }, [availablePool]);

  const addStudent = (name: string) => {
    const newStudent: Student = {
      id: crypto.randomUUID(),
      name: name.trim(),
      timesDrawn: 0,
    };
    setStudents(prev => [...prev, newStudent]);
    setAvailablePool(prev => [...prev, newStudent.id]);
  };

  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setAvailablePool(prev => prev.filter(studentId => studentId !== id));
  };

  const updateStudent = (id: string, name: string) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, name: name.trim() } : s
    ));
  };

  const drawStudents = (count: number = 3): Student[] => {
    if (students.length < count) return [];
    
    // إذا كانت القائمة المتاحة فارغة أو أقل من العدد المطلوب، نعيد تعبئتها
    let currentPool = [...availablePool];
    if (currentPool.length < count) {
      currentPool = students.map(s => s.id);
      setAvailablePool(currentPool);
    }
    
    // سحب عشوائي من القائمة المتاحة
    const shuffled = [...currentPool].sort(() => Math.random() - 0.5);
    const drawnIds = shuffled.slice(0, count);
    
    // إزالة المسحوبين من القائمة المتاحة
    const remainingPool = currentPool.filter(id => !drawnIds.includes(id));
    setAvailablePool(remainingPool);
    
    // الحصول على بيانات التلاميذ المسحوبين
    const drawn = students.filter(s => drawnIds.includes(s.id));
    
    const updatedStudents = students.map(student => {
      if (drawnIds.includes(student.id)) {
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
    // إعادة تعيين القائمة المتاحة عند الاستيراد
    setAvailablePool(data.map(s => s.id));
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
