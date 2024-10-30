import { useState } from 'react'
import { DepartmentIdAndName } from '../models/department'
import agent from '../api/agent'
import { Employee, NewEmployee } from '../models/employee'

interface AddEmployeeModalProps {
  departments: DepartmentIdAndName[]
  setData: (data: any) => void
}

export default function AddEmployeeModal({
  departments,
  setData,
}: AddEmployeeModalProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    position: '',
    department_id: '1',
  })

  const { firstName, lastName, age, position, department_id } = form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, department_id: e.target.value })
  }

  const handleSubmit = async () => {
    const employeeData: NewEmployee = {
      data: {
        type: 'employees', // specify the resource type
        attributes: {
          first_name: firstName,
          last_name: lastName,
          age: Number(age),
          position: position,
          department_id: Number(department_id),
        },
      },
    }

    try {
      const newEmployee = await agent.Employees.createEmployee(employeeData)

      setData((prevData: Employee[]) => [
        newEmployee.data.attributes,
        ...prevData,
      ])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <button
        className="btn btn-outline btn-ghost btn-normal border-slate-300"
        onClick={() =>
          (
            document.getElementById('my_modal_3') as HTMLDialogElement
          ).showModal()
        }
      >
        Add a new employee
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
            <div className="flex flex-col justify-center items-center">
              <h3 className="font-bold text-lg mb-2">Add new employee</h3>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="input input-bordered w-full max-w-xs my-2"
                value={firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="input input-bordered w-full max-w-xs my-2"
                value={lastName}
                onChange={handleChange}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                className="input input-bordered w-full max-w-xs my-2"
                value={age}
                onChange={handleChange}
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                className="input input-bordered w-full max-w-xs my-2"
                value={position}
                onChange={handleChange}
              />
              <select
                className="select select-bordered w-full max-w-xs my-2"
                value={department_id}
                onChange={handleSelectChange}
                name="department_id"
              >
                <option disabled className="text-gray-400">
                  Department
                </option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={handleSubmit}>
                Add
              </button>
              <button className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
