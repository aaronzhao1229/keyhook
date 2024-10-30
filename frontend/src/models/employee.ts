export interface apiResponse {
  id: string
  type: string
  attributes: Attributes
  relationships: Relationships
}

export interface Attributes {
  first_name: string
  last_name: string
  age: number
  position: string
  department_id: string | null
}

export interface Relationships {
  department: Department
}

export interface Department {
  links: Links
}

export interface Links {
  related: any
}

export interface Employee {
  first_name: string
  last_name: string
  age: number
  position: string
  department_name: string
}

export interface EmployeeParams {
  'filter[name]'?: string
  'filter[department_id]'?: string
  sort?: string
  'page[number]'?: number
}
