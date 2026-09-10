import { Employee } from "./Employee";
import { EmployeeDesignation } from "./types";

export class Ceo extends Employee {
  public constructor(id: string, name: string, dateOfBirth: string) {
    super(id, name, dateOfBirth, EmployeeDesignation.CEO);
  }
}

export class Director extends Employee {
  public constructor(id: string, name: string, dateOfBirth: string, reportsTo: string | null) {
    super(id, name, dateOfBirth, EmployeeDesignation.Director, reportsTo);
  }
}

export class Manager extends Employee {
  public constructor(id: string, name: string, dateOfBirth: string, reportsTo: string | null) {
    super(id, name, dateOfBirth, EmployeeDesignation.Manager, reportsTo);
  }
}

export class Lead extends Employee {
  public constructor(id: string, name: string, dateOfBirth: string, reportsTo: string | null) {
    super(id, name, dateOfBirth, EmployeeDesignation.Lead, reportsTo);
  }
}

export class Engineer extends Employee {
  public constructor(id: string, name: string, dateOfBirth: string, reportsTo: string | null) {
    super(id, name, dateOfBirth, EmployeeDesignation.Engineer, reportsTo);
  }
}
