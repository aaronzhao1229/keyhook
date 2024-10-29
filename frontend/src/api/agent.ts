import axios, { AxiosResponse } from "axios"

axios.defaults.baseURL = "http://localhost:4567/api/v1/"
const responseBody = (response: AxiosResponse) => response.data


const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
}

const Employees = {
  getEmployees: (params: URLSearchParams) => requests.get(`employees`, params),
}

const Departments = {
  getDepartments: () => requests.get(`departments`),
}

const agent = {
  Employees,
  Departments
}

export default agent