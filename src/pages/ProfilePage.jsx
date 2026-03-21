import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Profile</h2>
      
      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <div className="flex items-start gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{user?.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="text-lg text-gray-800">{user?.email}</p>
              </div>
              
              {user?.student_id && (
                <div>
                  <label className="text-sm text-gray-600">Student ID</label>
                  <p className="text-lg text-gray-800">{user?.student_id}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <p className="text-lg text-gray-800 font-semibold">{user?.role?.toUpperCase()}</p>
              </div>
              
              {user?.year && (
                <div>
                  <label className="text-sm text-gray-600">Year</label>
                  <p className="text-lg text-gray-800">Year {user?.year}</p>
                </div>
              )}
              
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
