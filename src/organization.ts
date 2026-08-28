import { Employee } from "./Employee";
import { EmployeeDesignation, EmployeeUpdates } from "./types";

const parentDesignation: Partial<Record<EmployeeDesignation, EmployeeDesignation>> = {
  [EmployeeDesignation.Director]: EmployeeDesignation.CEO,
  [EmployeeDesignation.Manager]: EmployeeDesignation.Director,
  [EmployeeDesignation.Lead]: EmployeeDesignation.Manager,
  [EmployeeDesignation.Engineer]: EmployeeDesignation.Lead,
};

export class Organization {
  private readonly employees = new Map<string, Employee>();

  public createEmployee(employee: Employee): Employee {
    this.validateEmployeeFields(employee);
    if (this.employees.has(employee.id)) {
      throw new Error(`Employee with ID ${employee.id} already exists.`);
    }
    const manager = this.validateReportingRelationship(employee.designation, employee.reportsTo);
    this.employees.set(employee.id, employee);
    if (manager !== null) {
      manager.reportees.push(employee.id);
    }
    return employee;
  }

  public getEmployee(id: string): Employee {
    const employee = this.employees.get(id);
    if (employee === undefined) {
      throw new Error(`Employee with ID ${id} does not exist.`);
    }
    return employee;
  }

  public getAllEmployees(): Employee[] {
    return [...this.employees.values()];
  }

  public updateEmployee(id: string, updates: EmployeeUpdates): Employee {
    const employee = this.getEmployee(id);
    const nextName = updates.name ?? employee.name;
    const nextDateOfBirth = updates.dateOfBirth ?? employee.dateOfBirth;
    const nextDesignation = updates.designation ?? employee.designation;
    const nextReportsTo = updates.reportsTo === undefined ? employee.reportsTo : updates.reportsTo;

    this.validateName(nextName);
    this.validateDateOfBirth(nextDateOfBirth);
    if (nextDesignation !== employee.designation && employee.reportees.length > 0) {
      throw new Error("Cannot change designation. All reportees should be reassigned first.");
    }

    const manager = this.validateReportingRelationship(nextDesignation, nextReportsTo, id);
    const oldManager = employee.reportsTo === null ? null : this.getEmployee(employee.reportsTo);
    if (oldManager !== manager) {
      if (oldManager !== null) {
        this.removeReportee(oldManager, id);
      }
      if (manager !== null && !manager.reportees.includes(id)) {
        manager.reportees.push(id);
      }
    }

    employee.name = nextName;
    employee.dateOfBirth = nextDateOfBirth;
    employee.designation = nextDesignation;
    employee.reportsTo = nextReportsTo;
    return employee;
  }

  public deleteEmployee(id: string): void {
    const employee = this.getEmployee(id);
    if (employee.reportees.length > 0) {
      throw new Error("Cannot delete employee. All reportees should be reassigned first.");
    }
    if (employee.reportsTo !== null) {
      this.removeReportee(this.getEmployee(employee.reportsTo), id);
    }
    this.employees.delete(id);
  }

  private validateEmployeeFields(employee: Employee): void {
    this.validateId(employee.id);
    this.validateName(employee.name);
    this.validateDateOfBirth(employee.dateOfBirth);
    if (!Object.values(EmployeeDesignation).includes(employee.designation)) {
      throw new Error("Invalid employee designation.");
    }
  }

  private validateId(id: string): void {
    if (typeof id !== "string" || id.trim().length === 0) {
      throw new Error("Employee ID cannot be empty.");
    }
  }

  private validateName(name: string): void {
    if (typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Employee name cannot be empty.");
    }
  }

  private validateDateOfBirth(dateOfBirth: string): void {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateOfBirth);
    if (match === null) {
      throw new Error("Date of birth must use MM/DD/YYYY format.");
    }
    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      throw new Error("Date of birth is invalid.");
    }
  }

  private validateReportingRelationship(
    designation: EmployeeDesignation,
    reportsTo: string | null,
    employeeId?: string,
  ): Employee | null {
    if (designation === EmployeeDesignation.CEO) {
      if (reportsTo !== null) {
        throw new Error("A CEO cannot report to another employee.");
      }
      const existingCeo = this.getAllEmployees().find((employee) => employee.designation === EmployeeDesignation.CEO && employee.id !== employeeId);
      if (existingCeo !== undefined) {
        throw new Error("The organization can have only one CEO.");
      }
      return null;
    }

    if (reportsTo === null) {
      throw new Error(`${designation} must report to an existing ${parentDesignation[designation]}.`);
    }
    const manager = this.getEmployee(reportsTo);
    if (manager.designation !== parentDesignation[designation]) {
      throw new Error(`${designation} must report to a ${parentDesignation[designation]}.`);
    }
    return manager;
  }

  private removeReportee(manager: Employee, employeeId: string): void {
    const index = manager.reportees.indexOf(employeeId);
    if (index >= 0) {
      manager.reportees.splice(index, 1);
    }
  }
}