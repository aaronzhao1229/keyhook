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
  paginate
 
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

  # filter :name, :string, single: true do
  #   eq do |scope, value|
  #     scope.where('LOWER(first_name) LIKE ?', "%#{value.downcase}%")
  #          .or(scope.where('LOWER(last_name) LIKE ?', "%#{value.downcase}%"))
  #   end
  # end

  # filter :department_id, :integer

  # add custom sorting and pagination
  sort :first_name, :last_name, :age, :position
 
 
  
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
    employees = EmployeeResource.all(params)

    employees.to_jsonapi
      # # Fetch paginated results with Kaminari using Graphiti resource
      # employees_scope = EmployeeResource.all(params).data

      # # Convert the Graphiti result back to an ActiveRecord relation
      # active_record_scope = Employee.where(id: employees_scope.map(&:id))
    
      # # Apply pagination
      # page_size = params.dig(:page, :size).to_i.nonzero? || 10
      # page_number = params.dig(:page, :number).to_i.nonzero? || 1
      # paginated_scope = active_record_scope.page(page_number).per(page_size)
    
      # # Get total count and page information based on the filtered scope
      # total_count = active_record_scope.count
      # total_pages = (total_count.to_f / page_size).ceil
      # current_page = page_number
    
      # # Convert paginated_scope to Graphiti resource
      # paginated_employees = EmployeeResource.all(params.merge(page: { size: page_size, number: page_number }))
    
      # # Render employees with pagination metadata
      # response = paginated_employees.to_jsonapi
    
      # # Manually inject pagination metadata into the response
      # response_hash = JSON.parse(response)
      # response_hash["meta"] = {
      #   total_count: total_count,
      #   total_pages: total_pages,
      #   current_page: current_page,
      #   page_size: page_size
      # }
    
      # # Return the updated response as JSON
      # JSON.generate(response_hash)
  end

  get '/api/v1/employees/:id' do
    employees = EmployeeResource.find(params)
    employees.to_jsonapi
  end
end
