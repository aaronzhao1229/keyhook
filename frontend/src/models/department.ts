export interface Department {
  id: string
  type: string
  attributes: Attributes
  relationships: Relationships
}

export interface Attributes {
  name: string
}

export interface Relationships {
  employees: Employees
}

export interface Employees {
  links: Links
}

export interface Links {
  related: string
}

export interface DepartmentIdAndName {
  id: string
  name: string
}