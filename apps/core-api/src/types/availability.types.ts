import { Types } from "mongoose";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TimeSlot {
  startTime: string; 
  endTime: string; 
}

export interface WeeklyRule {
  day: Weekday;
  isEnabled: boolean;
  slots: TimeSlot[];
}

export interface DateOverride {
  date: string; 
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface AvailabilityDocument {
  influencerProfileId: Types.ObjectId;

  timezone: string; 

  weeklyRules: WeeklyRule[];

  dateOverrides: DateOverride[];

  createdAt: Date;
  updatedAt: Date;
}