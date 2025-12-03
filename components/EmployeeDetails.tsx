
import React from 'react';
import { Employee } from '../types';
import { ArrowLeft, Mail, Calendar, Briefcase, Award } from 'lucide-react';

interface EmployeeDetailsProps {
  employee: Employee;
  onBack: () => void;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onBack }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b border-gray-100">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Employee Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal and professional details.
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
          employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          {employee.status}
        </span>
      </div>
      
      <div className="px-4 py-5 sm:p-0">
        <div className="sm:flex">
          <div className="sm:w-1/3 p-6 bg-white flex flex-col items-center text-center border-r border-gray-100">
            <img 
              className="h-32 w-32 rounded-full object-cover border-4 border-gray-50" 
              src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&size=200`} 
              alt="" 
            />
            <h2 className="mt-4 text-xl font-bold text-gray-900">{employee.firstName} {employee.lastName}</h2>
            <p className="text-primary-600 font-medium">{employee.role}</p>
            <p className="text-gray-500 text-sm mt-1">{employee.department}</p>
          </div>
          
          <div className="sm:w-2/3">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.email}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Joined Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.joinedDate}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" /> Bio
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {employee.bio || "No biography available."}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Award className="h-4 w-4 mr-2" /> Skills
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {employee.skills?.length > 0 ? (
                      employee.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">No skills listed</span>
                    )}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
