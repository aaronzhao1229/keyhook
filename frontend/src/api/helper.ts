import { EmployeeParams } from "../models/employee"

export function getAxiosParams(employeeParams: EmployeeParams) {
    const params = new URLSearchParams()
    if (employeeParams["filter[name]"]) params.append('filter[name]', employeeParams["filter[name]"])
    if (employeeParams["filter[department_id]"]) params.append('filter[department_id]', employeeParams["filter[department_id]"])
    if (employeeParams["sort"]) params.append('sort', employeeParams["sort"])
    if (employeeParams["page[number]"]) params.append('page[number]', employeeParams["page[number]"].toString())
    params.append('include', 'department')
    return params
}