import * as XLSX from 'xlsx';
import { Student } from '@/types/student';

export const exportToExcel = (students: Student[]) => {
  const data = students.map(s => ({
    'الاسم': s.name,
    'عدد مرات السحب': s.timesDrawn,
    'آخر سحب': s.lastDrawn ? new Date(s.lastDrawn).toLocaleDateString('ar-SA') : 'لم يتم السحب'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'التلاميذ');
  
  XLSX.writeFile(wb, `students_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (students: Student[]) => {
  const headers = ['الاسم', 'عدد مرات السحب', 'آخر سحب'];
  const rows = students.map(s => [
    s.name,
    s.timesDrawn.toString(),
    s.lastDrawn ? new Date(s.lastDrawn).toLocaleDateString('ar-SA') : 'لم يتم السحب'
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const importFromFile = (file: File): Promise<Student[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        const students: Student[] = jsonData.map((row: any) => ({
          id: crypto.randomUUID(),
          name: row['الاسم'] || row.name || '',
          timesDrawn: parseInt(row['عدد مرات السحب'] || row.timesDrawn || '0'),
          lastDrawn: row['آخر سحب'] ? new Date(row['آخر سحب']) : undefined
        }));
        
        resolve(students);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('فشل قراءة الملف'));
    reader.readAsBinaryString(file);
  });
};
