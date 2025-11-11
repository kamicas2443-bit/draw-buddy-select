import { Student } from '@/types/student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, TrendingUp, Users } from 'lucide-react';

interface StudentStatsProps {
  students: Student[];
}

export const StudentStats = ({ students }: StudentStatsProps) => {
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
