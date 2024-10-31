require 'faker'
require 'active_record'
require './seeds'
require 'kaminari'
require 'sinatra/base'
require 'graphiti'
require 'graphiti/adapters/active_record'

Graphiti.setup!
# Graphiti.config.links_on_demand = true # Ensure pagination links are included in metadata
Graphiti.config.pagination_links = true # Ensures pagination links are included


class ApplicationResource < Graphiti::Resource
  self.abstract_class = true
  self.adapter = Graphiti::Adapters::ActiveRecord
  self.base_url = 'http://localhost:4567'
  self.endpoint_namespace = '/api/v1'
  # implement Graphiti.config.context_for_endpoint for validation
  self.validate_endpoints = false
end

class DepartmentResource < ApplicationResource
  self.model = Department
  self.type = :departments

  attribute :name, :string
  has_many :employees
end

class EmployeeResource < ApplicationResource
  self.default_page_size = 20
   # Enable metadata for pagination counts
  # Disable default pagination by setting the default page size to nil
 

  attribute :first_name, :string
  attribute :last_name, :string
  attribute :age, :integer
  attribute :position, :string

  attribute :department_id, :integer

  # Custom attribute to include the department name directly in the employee's attributes
  attribute :department_name, :string do
    @object.department.name if @object.department
  end

  belongs_to :department

  filter :name, :string, single: true do
    eq do |scope, value|
      scope.where('LOWER(first_name) LIKE ?', "%#{value.downcase}%")
           .or(scope.where('LOWER(last_name) LIKE ?', "%#{value.downcase}%"))
    end
  end

  # filter :department_id, :integer
  # filter :id, :string do
  #   eq do |scope, value|
  #     scope.where(id: value)
  #   end
  # end

  # add custom sorting and pagination
  sort :first_name, :last_name, :age, :position
#  paginate
 # Override `records` method to add total count to metadata
  
end



class EmployeeDirectoryApp < Sinatra::Application
  configure do
    mime_type :jsonapi, 'application/vnd.api+json'
  end

  before do
    content_type :jsonapi
  end

  after do
    ActiveRecord::Base.connection_handler.clear_active_connections!
  end

  get '/api/v1/departments' do
    departments = DepartmentResource.all(params)
    departments.to_jsonapi
  end

  get '/api/v1/departments/:id' do
    departments = DepartmentResource.find(params)
    departments.to_jsonapi
  end

  get '/api/v1/employees' do
    puts 'hey'
    employees = EmployeeResource.all(params)
    employees.to_jsonapi
  end

  get '/api/v1/employees/:id' do
    employees = EmployeeResource.find(params)
    employees.to_jsonapi
  end

  post '/api/v1/employees' do
     # Parse the request body to get the employee attributes
    employee_params = JSON.parse(request.body.read)
   

   # Create a new Employee instance with the provided attributes
    employee = Employee.new(
      first_name: employee_params.dig('data', 'attributes', 'first_name'),
      last_name: employee_params.dig('data', 'attributes', 'last_name'),
      age: employee_params.dig('data', 'attributes', 'age'),
      position: employee_params.dig('data', 'attributes', 'position'),
      department_id: employee_params.dig('data', 'attributes', 'department_id')
    )
  
    # Check for existing employee with the same first_name and last_name
    existing_employee = Employee.find_by(
      first_name: employee.first_name,
      last_name: employee.last_name, 
      department_id: employee.department_id
    )
  
    if existing_employee
      # Respond with an error if an employee with the same name already exists
      response.status = 409  # HTTP Conflict
      return { errors: ["An employee with the name #{employee.first_name} #{employee.last_name} in this department already exists."] }.to_json
    end
 
    if employee.save
      # Respond with the created employee in JSON API format
      response.status = 201  # HTTP Created
      new_employee = Employee.find_by(
        first_name: employee.first_name,
        last_name: employee.last_name, 
        department_id: employee.department_id
      )
      # Use EmployeeResource to render the created employee with department relationship
      new_employee_resource = EmployeeResource.find({ id: new_employee.id })
      new_employee_resource.to_jsonapi
    
    else
      # Respond with errors if the save failed
      response.status = 422  # HTTP Unprocessable Entity
      { errors: employee.errors.full_messages }.to_json
    end
  end
end
