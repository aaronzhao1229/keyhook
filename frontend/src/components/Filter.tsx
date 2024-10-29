
import { EmployeeParams } from "../models/employee"
interface Props {
  employeePramas: EmployeeParams, 
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export const Filter = ({employeePramas, handleFilterChange}: Props) => {
  
  return  (
  <div className="max-w-96 flex items-center">
      <input
        type="text"
        id='filter[name]'
        value={employeePramas["filter[name]"] || ''}
        onChange={handleFilterChange}
        placeholder={`Search name...`}
        className="p-2 w-full border rounded-lg h-10"
        />
  </div>
  )
  
       
}