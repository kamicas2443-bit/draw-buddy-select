import { useState, useRef } from 'react';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Check, X, Upload, Download, FileSpreadsheet } from 'lucide-react';
import { exportToExcel, exportToCSV, importFromFile } from '@/utils/export';
import { useToast } from '@/hooks/use-toast';

interface StudentManagerProps {
  students: Student[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
  onImport: (students: Student[]) => void;
}

export const StudentManager = ({ students, onAdd, onRemove, onUpdate, onImport }: StudentManagerProps) => {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName);
      setNewName('');
      toast({
        title: "تم الإضافة",
        description: `تم إضافة ${newName} بنجاح`,
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditingName(student.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdate(editingId, editingName);
      setEditingId(null);
      setEditingName('');
      toast({
        title: "تم التحديث",
        description: "تم تحديث اسم التلميذ بنجاح",
      });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedStudents = await importFromFile(file);
      onImport(importedStudents);
      toast({
        title: "تم الاستيراد",
        description: `تم استيراد ${importedStudents.length} تلميذ بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل استيراد الملف",
        variant: "destructive",
      });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>إدارة التلاميذ</span>
          <span className="text-lg font-normal text-muted-foreground">
            ({students.length} تلميذ)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="اسم التلميذ..."
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            className="text-right"
          />
          <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
            إضافة
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => exportToExcel(students)}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={students.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4" />
            تصدير Excel
          </Button>
          <Button
            onClick={() => exportToCSV(students)}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={students.length === 0}
          >
            <Download className="w-4 h-4" />
            تصدير CSV
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            استيراد
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              {editingId === student.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 text-right"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
                    <Check className="w-4 h-4 text-secondary" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4 text-destructive" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-right font-medium">{student.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {student.timesDrawn} مرات
                  </span>
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(student)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      onRemove(student.id);
                      toast({
                        title: "تم الحذف",
                        description: `تم حذف ${student.name}`,
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
