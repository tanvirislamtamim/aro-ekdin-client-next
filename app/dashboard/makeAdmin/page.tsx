"use client";

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import DeveloperRoute from '../../../components/Routes/DeveloperRoute';

interface UserItem {
  _id: string;
  email: string;
  name?: string;
  role?: string;
}

const MakeAdminContent = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: users = [], isLoading } = useQuery<UserItem[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  const { mutateAsync: updateRole } = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      return await axiosSecure.patch(`/users/role/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire({
        icon: 'success',
        title: 'Role Updated!',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
    }
  });

  if (isLoading) return <div className="text-white text-center mt-20">Loading Users...</div>;

  return (
    <div className="p-6 bg-[#0b0f12] text-white">
      <h2 className="text-2xl font-bold mb-6">Manage User Roles</h2>
      <div className="overflow-x-auto">
        <table className="table w-full bg-[#111820] rounded-xl">
          <thead>
            <tr className="text-gray-400">
              <th>#</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className="border-b border-white/5">
                <th>{index + 1}</th>
                <td>{user.email}</td>
                <td className="capitalize">{user.role || 'User'}</td>
                <td>
                  {user.role === 'admin' ? (
                    <button 
                      onClick={() => updateRole({ id: user._id, role: 'user' })}
                      className="btn btn-sm btn-outline btn-error cursor-pointer"
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateRole({ id: user._id, role: 'admin' })}
                      className="btn btn-sm bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 border-none text-slate-900 hover:opacity-90 cursor-pointer"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function MakeAdminPage() {
  return (
    <DeveloperRoute>
      <MakeAdminContent />
    </DeveloperRoute>
  );
}
