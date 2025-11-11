import { DrawHistory as DrawHistoryType } from '@/types/student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DrawHistoryProps {
  history: DrawHistoryType[];
  onClear: () => void;
}

export const DrawHistory = ({ history, onClear }: DrawHistoryProps) => {
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
                  {entry.students.map((student, idx) => (
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
