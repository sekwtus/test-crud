
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';
import { EmployeeDetails } from './components/EmployeeDetails';
import { db } from './services/db';
import { Employee, ViewState } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LIST);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await db.getAll();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedEmployee(undefined);
    setView(ViewState.CREATE);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setView(ViewState.EDIT);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setView(ViewState.DETAILS);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await db.delete(id);
        await loadEmployees();
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  const handleFormSubmit = async (data: Omit<Employee, 'id'>) => {
    try {
      if (view === ViewState.EDIT && selectedEmployee) {
        await db.update(selectedEmployee.id, data);
      } else {
        await db.create(data);
      }
      await loadEmployees();
      setView(ViewState.LIST);
    } catch (err) {
      console.error(err);
      throw err; // Form component will catch this
    }
  };

  return (
    <Layout>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {loading && employees.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <>
          {view === ViewState.LIST && (
            <EmployeeList
              employees={employees}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          )}

          {(view === ViewState.CREATE || view === ViewState.EDIT) && (
            <EmployeeForm
              initialData={selectedEmployee || {}}
              isEditing={view === ViewState.EDIT}
              onSubmit={handleFormSubmit}
              onCancel={() => setView(ViewState.LIST)}
            />
          )}

          {view === ViewState.DETAILS && selectedEmployee && (
            <EmployeeDetails
              employee={selectedEmployee}
              onBack={() => setView(ViewState.LIST)}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
