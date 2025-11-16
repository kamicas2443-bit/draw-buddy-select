import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudents } from '@/hooks/useStudents';
import { Student } from '@/types/student';
import { Shuffle, Sparkles, Trophy, Calendar, Trash2, Edit2, Check, X, Upload, Download, FileSpreadsheet, Clock, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportToExcel, exportToCSV, importFromFile } from '@/utils/export';

// مكون بطاقة التلميذ المسحوب
const StudentCard = ({ student, index }: { student: Student; index: number }) => {
  const medals = ['🥇', '🥈', '🥉'];
  
  return (
    <Card 
      className="p-6 text-center animate-bounce-in backdrop-blur-sm bg-card/80 border-2 shadow-xl hover:shadow-2xl transition-all duration-300"
      style={{ 
        animationDelay: `${index * 150}ms`,
        background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)) 100%)`
      }}
    >
      <div className="text-6xl mb-4 animate-float">
        {medals[index] || '🎓'}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">
        {student.name}
      </h3>
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Trophy className="w-4 h-4" />
          <span>{student.timesDrawn} مرات</span>
        </div>
        {student.lastDrawn && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(student.lastDrawn).toLocaleDateString('ar-SA')}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// مكون إحصائيات التلاميذ
const StudentStats = ({ students }: { students: Student[] }) => {
  const totalDraws = students.reduce((sum, s) => sum + s.timesDrawn, 0);
  const topStudent = students.length > 0 
    ? students.reduce((max, s) => s.timesDrawn > max.timesDrawn ? s : max, students[0])
    : null;
  const avgDraws = students.length > 0 ? (totalDraws / students.length).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            إجمالي التلاميذ
          </CardTitle>
          <Users className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{students.length}</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            أكثر تلميذ تم سحبه
          </CardTitle>
          <Trophy className="w-5 h-5 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">
            {topStudent ? topStudent.name : '--'}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {topStudent ? `${topStudent.timesDrawn} مرات` : 'لا يوجد'}
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            متوسط السحب
          </CardTitle>
          <TrendingUp className="w-5 h-5 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">{avgDraws}</div>
          <p className="text-sm text-muted-foreground mt-1">مرة لكل تلميذ</p>
        </CardContent>
      </Card>
    </div>
  );
};

// مكون إدارة التلاميذ
const StudentManager = ({ 
  students, 
  onAdd, 
  onRemove, 
  onUpdate, 
  onImport 
}: { 
  students: Student[]; 
  onAdd: (name: string) => void; 
  onRemove: (id: string) => void; 
  onUpdate: (id: string, name: string) => void; 
  onImport: (students: Student[]) => void; 
}) => {
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

// مكون سجل السحوبات
const DrawHistory = ({ history, onClear }: { history: any[]; onClear: () => void }) => {
  if (history.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">سجل السحوبات</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            لا يوجد سجل للسحوبات بعد
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">سجل السحوبات</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 ml-2" />
          مسح السجل
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(entry.date).toLocaleString('ar-SA')}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {entry.students.map((student: Student, idx: number) => (
                    <span
                      key={student.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {student.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// المكون الرئيسي
const Index = () => {
  const {
    students,
    history,
    addStudent,
    removeStudent,
    updateStudent,
    drawStudents,
    importStudents,
    clearHistory,
    resetDrawCycle
  } = useStudents();
  
  const [drawnStudents, setDrawnStudents] = useState<Student[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const handleDraw = () => {
    if (students.length < 3) {
      toast({
        title: "عدد التلاميذ غير كافٍ",
        description: "يجب أن يكون لديك على الأقل 3 تلاميذ للقيام بالسحب",
        variant: "destructive",
      });
      return;
    }

    setIsDrawing(true);
    setDrawnStudents([]);

    setTimeout(() => {
      const drawn = drawStudents(3);
      setDrawnStudents(drawn);
      setIsDrawing(false);
      
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA8PVqzn77BdGgU+luLxuV8ZBCuFzvLcizsIGGS55+ii=');
      audio.play().catch(() => {});
      
      toast({
        title: "تم السحب! 🎉",
        description: `تم اختيار ${drawn.length} تلاميذ بنجاح`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-slide-up">
            نظام السحب العشوائي للتلاميذ
          </h1>
          <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '100ms' }}>
            سحب عادل وممتع لاختيار التلاميذ 🎓
          </p>
        </div>

        <StudentStats students={students} />

        <div className="my-8">
          <div className="text-center mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleDraw}
              disabled={isDrawing || students.length < 3}
              size="lg"
              className="text-xl px-12 py-6 bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              {isDrawing ? (
                <>
                  <Sparkles className="w-6 h-6 ml-2 animate-spin" />
                  جارٍ السحب...
                </>
              ) : (
                <>
                  <Shuffle className="w-6 h-6 ml-2" />
                  سحب 3 تلاميذ
                </>
              )}
            </Button>
            
            <Button
              onClick={() => {
                resetDrawCycle();
                toast({
                  title: "تم إعادة التعيين ✅",
                  description: "تم إعادة تعيين دورة السحب. يمكن الآن سحب جميع التلاميذ من جديد",
                });
              }}
              disabled={isDrawing}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 hover:bg-secondary/10 transition-all duration-300"
            >
              <Clock className="w-5 h-5 ml-2" />
              إعادة تعيين الدورة
            </Button>
          </div>

          {isDrawing && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin-slow text-8xl">
                🎰
              </div>
              <p className="text-2xl font-semibold mt-4 text-primary animate-pulse">
                يتم اختيار التلاميذ...
              </p>
            </div>
          )}

          {!isDrawing && drawnStudents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {drawnStudents.map((student, index) => (
                <StudentCard key={student.id} student={student} index={index} />
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="manage" className="mt-12" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="manage" className="text-lg">
              إدارة التلاميذ
            </TabsTrigger>
            <TabsTrigger value="history" className="text-lg">
              سجل السحوبات
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <StudentManager
              students={students}
              onAdd={addStudent}
              onRemove={removeStudent}
              onUpdate={updateStudent}
              onImport={importStudents}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <DrawHistory history={history} onClear={clearHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
