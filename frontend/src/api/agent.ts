import axios, { AxiosResponse, AxiosError } from 'axios'

axios.defaults.baseURL = 'http://localhost:4567/api/v1/'
const responseBody = (response: AxiosResponse) => response.data

axios.interceptors.response.use(
  async (response) => {
    // if (process.env.NODE_ENV === 'development') await sleep()
    // const pagination = response.headers['pagination'] // need to be lower case even if there are upper cases in the header
    // if (pagination) {
    //   response.data = new PaginatedResponse(
    //     response.data,
    //     JSON.parse(pagination)
    //   )
    //   return response
    // }
    return response
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse // add as AxiosResponse to remove the error from the interceptor

    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = []
          for (const key in data.errors) {
            if (data.errors[key]) {
              // this if statement purly for TS purposes, just an extra bit of boilerplate so that we don't see a type error on the following line
              modelStateErrors.push(data.errors[key])
            }
          }
          throw modelStateErrors.flat() // flat the array to strings of the problems. Use throw to stop the code running here and the following code would not run
        }
        alert(data.errors[0])
        break
      case 401:
        alert(data.errors[0])
        break
      case 403:
        alert('You are not allowed to do that!')
        break
      case 409:
        alert(data.errors[0])
        break
      case 500:
        alert('Server error')
        break
    }

    return Promise.reject(error.response) // we are not able to catch and handle the responses in Axios interceptors. That's not what they say it's been designed for. Therefore, we still need to catch the errors inside our components as well. We still need to catch the error at the end of the errors journey which is inside the AboutPage for error tests
  }
)

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body, {
        headers: {
          'Content-Type': 'application/vnd.api+json', // JSON:API specific content type
        },
      })
      .then(responseBody),
}

const Employees = {
  getEmployees: (params: URLSearchParams) => requests.get(`employees`, params),
  createEmployee: (body: any) => requests.post(`employees`, body),
}

const Departments = {
  getDepartments: () => requests.get(`departments`),
}

const agent = {
  Employees,
  Departments,
}

export default agent
