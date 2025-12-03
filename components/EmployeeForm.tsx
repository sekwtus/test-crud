
import React, { useState } from 'react';
import { Employee } from '../types';
import { generateEmployeeProfile } from '../services/gemini';
import { Sparkles, Save, X, Loader2 } from 'lucide-react';

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: Omit<Employee, 'id'>) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isEditing
}) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    status: 'Active',
    joinedDate: new Date().toISOString().split('T')[0],
    bio: '',
    skills: [],
    ...initialData
  });

  const [loading, setLoading] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleGenerateProfile = async () => {
    if (!formData.role || !formData.department) {
      alert("Please fill in Role and Department first.");
      return;
    }

    setGeneratingAi(true);
    try {
      const { bio, skills } = await generateEmployeeProfile(
        formData.role!,
        formData.department!,
        `${formData.firstName} ${formData.lastName}`
      );
      setFormData(prev => ({ ...prev, bio, skills }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate profile. Please check API configuration.");
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
        throw new Error("Please fill in all required fields");
      }
      
      await onSubmit(formData as Omit<Employee, 'id'>);
    } catch (error) {
      console.error(error);
      alert("Error saving employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Edit Employee' : 'Add New Employee'}
        </h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              name="department"
              required
              value={formData.department}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="IT Security">IT Security</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Joined Date</label>
            <input
              type="date"
              name="joinedDate"
              value={formData.joinedDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
            />
          </div>
        </div>

        {/* AI Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-md border border-blue-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-blue-900 flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-blue-600" />
              AI Assistant
            </h3>
            <button
              type="button"
              onClick={handleGenerateProfile}
              disabled={generatingAi || !formData.role || !formData.department}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {generatingAi ? (
                <>
                  <Loader2 className="animate-spin h-3 w-3 mr-1" /> Generating...
                </>
              ) : (
                'Generate Bio & Skills'
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Biography</label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                placeholder="Click generate or write manually..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills?.join(', ')}
                onChange={handleSkillsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                placeholder="React, TypeScript, Leadership..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Employee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
