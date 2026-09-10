import { EmployeeDesignation, EmployeeRecord } from "./types";

export class Employee implements EmployeeRecord {
  public readonly reportees: string[] = [];

  public constructor(
    public readonly id: string,
    public name: string,
    public dateOfBirth: string,
    public designation: EmployeeDesignation,
    public reportsTo: string | null = null,
  ) {}
}