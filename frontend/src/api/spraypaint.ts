import {
  Model,
  SpraypaintBase,
  Attr,
  BelongsTo,
  HasMany,
  // etc
} from 'spraypaint'
import { Department } from '../models/department'

@Model()
class ApplicationRecord extends SpraypaintBase {
  static baseUrl = 'http://localhost:4567'
  static apiNamespace = '/api/v1'
}

@Model()
class Employees extends ApplicationRecord {
  static jsonapiType = 'employees'

  @Attr() first_name!: string
  @Attr() last_name!: string
  @Attr() age!: number
  @Attr() position!: string
  @Attr() department_id!: number
  @Attr() department_name!: string

  // Define relationships if necessary
  @BelongsTo('departments') // Use the relationship name as per the JSON response
  department!: Department // Assuming you have a Department model defined
}

@Model()
class Departments extends ApplicationRecord {
  static jsonapiType = 'departments'

  @Attr() name!: string
  @HasMany('employees') employees!: Employees[]
}

export default Employees
