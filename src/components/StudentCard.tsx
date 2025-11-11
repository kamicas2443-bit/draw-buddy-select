import { Student } from '@/types/student';
import { Card } from '@/components/ui/card';
import { Trophy, Calendar } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  index: number;
}

export const StudentCard = ({ student, index }: StudentCardProps) => {
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
