
import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { Edit2, Trash2, Search, UserPlus, Eye, Briefcase, Mail, Users } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onView: (employee: Employee) => void;
  onCreate: () => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees, 
  onEdit, 
  onDelete, 
  onView, 
  onCreate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const departments = useMemo(() => {
    const depts = new Set(employees.map(e => e.department));
    return ['All', ...Array.from(depts)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = (
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesDept = filterDept === 'All' || employee.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, filterDept]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          
          <button
            onClick={onCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img 
                    className="h-12 w-12 rounded-full object-cover bg-gray-100" 
                    src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=random`} 
                    alt="" 
                  />
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{employee.role}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span className="truncate">{employee.department}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <span className="truncate">{employee.email}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3 border-t border-gray-100">
              <button 
                onClick={() => onView(employee)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="View Details"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onEdit(employee)} 
                className="text-primary-600 hover:text-primary-800 transition-colors"
                title="Edit"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(employee.id)} 
                className="text-red-400 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};
