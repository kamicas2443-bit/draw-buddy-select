export interface Student {
  id: string;
  name: string;
  timesDrawn: number;
  lastDrawn?: Date;
}

export interface DrawHistory {
  id: string;
  students: Student[];
  date: Date;
}
