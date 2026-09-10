import assert from "node:assert/strict";
import { Employee } from "./Employee";
import { Ceo, Director, Engineer, Lead, Manager } from "./designatedEmployees";
import { Organization } from "./organization";
import { EmployeeDesignation } from "./types";

const createEmployee = (id: string, designation: EmployeeDesignation, reportsTo: string | null = null): Employee => {
  const name = `${designation} ${id}`;
  const dateOfBirth = "08/28/2000";

  switch (designation) {
    case EmployeeDesignation.CEO:
      return new Ceo(id, name, dateOfBirth);
    case EmployeeDesignation.Director:
      return new Director(id, name, dateOfBirth, reportsTo);
    case EmployeeDesignation.Manager:
      return new Manager(id, name, dateOfBirth, reportsTo);
    case EmployeeDesignation.Lead:
      return new Lead(id, name, dateOfBirth, reportsTo);
    case EmployeeDesignation.Engineer:
      return new Engineer(id, name, dateOfBirth, reportsTo);
  }
};

const expectError = (operation: () => unknown, message: string): void => {
  assert.throws(operation, new RegExp(message));
};

const runChecks = (): void => {
  const organization = new Organization();

  organization.createEmployee(createEmployee("CEO-1", EmployeeDesignation.CEO));
  organization.createEmployee(createEmployee("DIR-1", EmployeeDesignation.Director, "CEO-1"));
  organization.createEmployee(createEmployee("MGR-1", EmployeeDesignation.Manager, "DIR-1"));
  organization.createEmployee(createEmployee("LEAD-1", EmployeeDesignation.Lead, "MGR-1"));
  organization.createEmployee(createEmployee("ENG-1", EmployeeDesignation.Engineer, "LEAD-1"));
  assert.equal(organization.getEmployee("ENG-1").reportsTo, "LEAD-1");
  assert.equal(organization.getAllEmployees().length, 5);

  expectError(() => organization.createEmployee(createEmployee("ENG-1", EmployeeDesignation.Engineer, "LEAD-1")), "already exists");
  expectError(() => organization.createEmployee(createEmployee("CEO-2", EmployeeDesignation.CEO)), "only one CEO");
  expectError(() => organization.createEmployee(createEmployee("DIR-2", EmployeeDesignation.Director)), "existing CEO");
  expectError(() => organization.createEmployee(createEmployee("MGR-2", EmployeeDesignation.Manager, "CEO-1")), "Director");
  expectError(() => organization.createEmployee(createEmployee("LEAD-2", EmployeeDesignation.Lead, "DIR-1")), "Manager");
  expectError(() => organization.createEmployee(createEmployee("ENG-2", EmployeeDesignation.Engineer, "MGR-1")), "Lead");
  expectError(() => organization.createEmployee(new Employee("", "Name", "08/28/2000", EmployeeDesignation.CEO)), "ID cannot be empty");
  expectError(() => organization.createEmployee(new Employee("EMPTY-NAME", " ", "08/28/2000", EmployeeDesignation.CEO)), "name cannot be empty");
  expectError(() => organization.createEmployee(new Employee("BAD-DESIGNATION", "Name", "08/28/2000", "Invalid" as EmployeeDesignation)), "Invalid employee designation");
  expectError(() => organization.createEmployee(new Employee("BAD-DATE", "Name", "13/40/2000", EmployeeDesignation.CEO)), "invalid");
  expectError(() => organization.createEmployee(new Employee("BAD-FORMAT", "Name", "2000-08-28", EmployeeDesignation.CEO)), "MM/DD/YYYY");

  organization.createEmployee(createEmployee("DIR-2", EmployeeDesignation.Director, "CEO-1"));
  organization.updateEmployee("DIR-2", { name: "Updated Director" });
  assert.equal(organization.getEmployee("DIR-2").name, "Updated Director");
  expectError(() => organization.updateEmployee("MISSING", { name: "Nobody" }), "does not exist");
  expectError(() => organization.updateEmployee("DIR-2", { dateOfBirth: "invalid" }), "MM/DD/YYYY");
  expectError(() => organization.updateEmployee("DIR-2", { reportsTo: "MGR-1" }), "CEO");
  expectError(() => organization.updateEmployee("DIR-1", { designation: EmployeeDesignation.Manager }), "reportees");

  const emptyLead = createEmployee("LEAD-2", EmployeeDesignation.Lead, "MGR-1");
  organization.createEmployee(emptyLead);
  organization.updateEmployee("LEAD-2", { designation: EmployeeDesignation.Engineer, reportsTo: "LEAD-1" });
  assert.equal(organization.getEmployee("LEAD-2").designation, EmployeeDesignation.Engineer);

  expectError(() => organization.deleteEmployee("MGR-1"), "reportees");
  expectError(() => organization.deleteEmployee("MISSING"), "does not exist");
  organization.deleteEmployee("ENG-1");
  assert.deepEqual(organization.getEmployee("LEAD-1").reportees, ["LEAD-2"]);
  organization.deleteEmployee("LEAD-2");
  assert.deepEqual(organization.getEmployee("LEAD-1").reportees, []);
  assert.deepEqual(organization.getEmployee("MGR-1").reportees, ["LEAD-1"]);

  console.log("All checks passed successfully.");
};

runChecks();
