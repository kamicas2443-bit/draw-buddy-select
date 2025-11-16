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
    
    console.log('━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎲 بدء عملية السحب');
    
    // الحصول على جميع معرفات الطلاب
    const allIds = students.map(s => s.id);
    console.log(`📋 إجمالي الطلاب: ${allIds.length}`);
    console.log(`🎯 عدد المطلوب سحبه: ${count}`);
    
    // تنظيف القائمة المتاحة من أي طلاب محذوفين
    let pool = availablePool.filter(id => allIds.includes(id));
    console.log(`✅ المتاحون حالياً: ${pool.length}`);
    
    // إذا لم يكن هناك طلاب كافيين، ابدأ دورة جديدة
    if (pool.length < count) {
      console.log('🔄 بدء دورة جديدة - إعادة تعبئة القائمة');
      pool = [...allIds];
    }
    
    // خلط القائمة وسحب العدد المطلوب
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, count);
    
    console.log('🎯 تم اختيار:', selectedIds);
    
    // تحديث القائمة المتاحة (إزالة من تم سحبهم)
    const newPool = pool.filter(id => !selectedIds.includes(id));
    console.log(`📝 المتبقون: ${newPool.length}`);
    
    setAvailablePool(newPool);
    
    // الحصول على بيانات الطلاب المسحوبين
    const drawnStudents = students
      .filter(s => selectedIds.includes(s.id))
      .map(s => ({
        ...s,
        timesDrawn: s.timesDrawn + 1,
        lastDrawn: new Date()
      }));
    
    // تحديث قائمة الطلاب
    setStudents(prev => prev.map(s => {
      const drawn = drawnStudents.find(d => d.id === s.id);
      return drawn || s;
    }));
    
    // إضافة للسجل
    setHistory(prev => [{
      id: crypto.randomUUID(),
      students: drawnStudents,
      date: new Date()
    }, ...prev].slice(0, 50));
    
    console.log('✅ انتهى السحب بنجاح');
    console.log('━━━━━━━━━━━━━━━━━━━━━');
    
    return drawnStudents;
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
