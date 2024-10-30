export default function AddEmployeeModal() {
  return (
    <>
      <button
        className="mr-2 border border-slate-300 rounded hover:cursor-pointer hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() =>
          (
            document.getElementById('my_modal_1') as HTMLDialogElement
          ).showModal()
        }
      >
        Add a new employee
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
