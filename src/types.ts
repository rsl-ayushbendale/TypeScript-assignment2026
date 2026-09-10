export enum EmployeeDesignation {
  Engineer = "Engineer",
  Lead = "Lead",
  Manager = "Manager",
  Director = "Director",
  CEO = "CEO",
}

export interface EmployeeRecord {
  readonly id: string;
  name: string;
  dateOfBirth: string;
  designation: EmployeeDesignation;
  reportsTo: string | null;
  readonly reportees: string[];
}

// ID is immutable, and reportees are managed by Organization to preserve hierarchy links.
export type EmployeeUpdates = {
  name?: string;
  dateOfBirth?: string;
  designation?: EmployeeDesignation;
  reportsTo?: string | null;
};