import { DepartmentIdAndName } from '../models/department'

export default function AddEmployeeModal({
  departments,
}: {
  departments: DepartmentIdAndName[]
}) {
  const handleSubmit = () => {
    console.log('submit')
  }
  return (
    <>
      <button
        className="btn"
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
                placeholder="First name"
                className="input input-bordered w-full max-w-xs my-2"
              />
              <input
                type="text"
                placeholder="Last name"
                className="input input-bordered w-full max-w-xs my-2"
              />
              <input
                type="number"
                placeholder="Age"
                className="input input-bordered w-full max-w-xs my-2"
              />
              <input
                type="text"
                placeholder="Position"
                className="input input-bordered w-full max-w-xs my-2"
              />
              <select className="select select-bordered w-full max-w-xs">
                <option disabled selected>
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
