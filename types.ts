export type ProcessedSlot = {
  startTime: string;
  endTime: string;
  totalMinutes: number;
  courtIds: number[];
};

export type DayAvailability = {
  date: string;
  availableSlots: ProcessedSlot[];
};
