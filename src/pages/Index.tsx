import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StudentCard } from '@/components/StudentCard';
import { StudentManager } from '@/components/StudentManager';
import { DrawHistory } from '@/components/DrawHistory';
import { StudentStats } from '@/components/StudentStats';
import { useStudents } from '@/hooks/useStudents';
import { Student } from '@/types/student';
import { Shuffle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const {
    students,
    history,
    addStudent,
    removeStudent,
    updateStudent,
    drawStudents,
    importStudents,
    clearHistory
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
          <div className="text-center mb-6">
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
