import React, { useMemo, useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  PaginationState,
} from '@tanstack/react-table'

import { apiResponse, Employee, EmployeeParams } from '../models/employee'
import agent from '../api/agent'
import { Filter } from './Filter'
import { getAxiosParams } from '../api/helper'
import {
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { Department, DepartmentIdAndName } from '../models/department'
import { Dropdown } from './Dropdown'
import { getPageNumber } from '../helper/helper'
import AddEmployeeModal from './AddEmployeeModal'
import Employees from '../api/spraypaint'

const EmployeeTable: React.FC = () => {
  const [data, setData] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<DepartmentIdAndName[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const [pageCount, setPageCount] = useState<number>(50)

  const [employeePramas, setEmployeePramas] = useState<EmployeeParams>({
    //   include: 'department',
  })

  // fetch employees data with params
  const fetchEmployees = async (params: EmployeeParams) => {
    // const axiosParams = getAxiosParams(params)
    // return agent.Employees.getEmployees(axiosParams)
    //   .then((employeesData) => {
    //     const employees = employeesData.data.map(
    //       (employee: apiResponse) => employee.attributes
    //     )
    //     setPageCount(getPageNumber(employeesData.links.last))
    //     setData(employees)
    //     return employees
    //   })
    //   .catch((error) => {
    //     setError(error.message)
    //   })
    const employeesData = await Employees.all()
    console.log(employeesData)
    const employees = employeesData.data.map((employee) => employee.attributes)
    // setPageCount(getPageNumber(employeesData.links.last))
    setPageCount(employeesData.data.length)
    setData(employees)
    return employees
  }

  const fetchDepartments = () => {
    agent.Departments.getDepartments()
      .then((departmentsData) => {
        const departmentIdsAndNames: DepartmentIdAndName[] =
          departmentsData.data.map((department: Department) => {
            return { id: department.id, name: department.attributes.name }
          })
        setDepartments(departmentIdsAndNames)
      })
      .catch((error) => {
        setError(error.message)
      })
  }

  // handle search by name
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeePramas((prev) => ({ ...prev, 'filter[name]': e.target.value }))
    fetchEmployees({ ...employeePramas, 'filter[name]': e.target.value })
  }

  // handle filter by department
  const handleSelectedDepartmentChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value !== '0') {
      // reset the page index to 1
      table.resetPageIndex()
      setEmployeePramas((prev) => ({
        ...prev,
        'page[number]': 1,
        'filter[department_id]': e.target.value,
      }))
      fetchEmployees({
        ...employeePramas,
        'page[number]': 1,
        'filter[department_id]': e.target.value,
      })
    } else {
      const newState = { ...employeePramas }
      delete newState['filter[department_id]']
      setEmployeePramas(newState)
      fetchEmployees(newState)
    }
  }

  useEffect(() => {
    fetchEmployees({})
    fetchDepartments()
    setLoading(false)
  }, [])

  // define columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'first_name',
        header: 'First Name',
        cell: (props) => <p>{props.getValue()}</p>,
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: (props) => <p>{props.getValue()}</p>,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        cell: (props) => <p>{props.getValue()}</p>,
      },
      {
        accessorKey: 'position',
        header: 'Position',
        cell: (props) => <p>{props.getValue()}</p>,
      },
      {
        accessorKey: 'department_name',
        header: 'Department',
        cell: (props) => <p>{props.getValue()}</p>,
        enableSorting: false,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: 50,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  })

  useEffect(() => {
    // sorting
    // if sorting is applied
    if (table.getState().sorting.length > 0) {
      // get the sorting id ready for the backend
      const sortId = table.getState().sorting[0].desc
        ? '-' + table.getState().sorting[0].id
        : table.getState().sorting[0].id

      setEmployeePramas((prev) => ({ ...prev, sort: sortId }))
      fetchEmployees({ ...employeePramas, sort: sortId })
    } else {
      // if sorting is not applied, remove the sort param
      const { sort, ...newValues } = employeePramas
      setEmployeePramas(newValues)
      fetchEmployees(newValues)
    }
  }, [table.getState().sorting])

  useEffect(() => {
    // pagination
    const pageIndex = table.getState().pagination.pageIndex + 1
    if (pageIndex !== employeePramas['page[number]']) {
      setEmployeePramas((prev) => ({ ...prev, 'page[number]': pageIndex }))
      fetchEmployees({ ...employeePramas, 'page[number]': pageIndex })
    }
  }, [table.getState().pagination.pageIndex])

  if (loading) {
    return <div className="flex justify-center mt-16">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center mt-16">
        {error} {'. Please contact the developer.'}
      </div>
    )
  }

  return (
    <div className="px-16 py-8 w-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex justify-left">
          <Filter
            employeePramas={employeePramas}
            handleFilterChange={handleFilterChange}
          />
          <Dropdown
            options={[
              { id: '0', name: 'Filter by department' },
              ...departments,
            ]}
            handleSelectChange={handleSelectedDepartmentChange}
          />
        </div>
        {departments.length > 0 && (
          <AddEmployeeModal departments={departments} setData={setData} />
        )}
      </div>

      <table className="table-auto border-collapse border border-slate-400">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border border-slate-300 bg-slate-100 py-2"
                >
                  <div className="flex items-center justify-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanSort() && (
                      <ArrowsUpDownIcon
                        className={'mx-2 hover:cursor-pointer text-slate-500'}
                        width={20}
                        onClick={header.column.getToggleSortingHandler()}
                      />
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-slate-300">
                  <div className="flex items-center justify-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className="my-4">
        <p className="text-sm mb-2">
          Page {table.getState().pagination.pageIndex + 1} of {pageCount}
        </p>
        <button
          className="mr-2 border border-slate-300 rounded hover:cursor-pointer hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={table.previousPage}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon width={20} />
        </button>
        <button
          className="mr-2 border border-slate-300 rounded hover:cursor-pointer hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={table.nextPage}
          disabled={
            !table.getCanNextPage() ||
            table.getState().pagination.pageIndex + 1 === pageCount
          }
        >
          <ChevronRightIcon width={20} />
        </button>
      </div>
    </div>
  )
}

export default EmployeeTable
