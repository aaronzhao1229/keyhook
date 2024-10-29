import { Field, Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import { DepartmentIdAndName } from '../models/department'

interface Props {
  options: DepartmentIdAndName[]
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
export const Dropdown = ({ options, handleSelectChange }: Props) => {
  return (
    <div className="w-full max-w-96 px-4 mb-3">
      <Field>
        <div className="relative rounded-lg">
          <Select
            className={clsx(
              'mt-3 h-10 block w-full appearance-none rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black'
            )}
            onChange={handleSelectChange}
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
            aria-hidden="true"
          />
        </div>
      </Field>
    </div>
  )
}
