"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import AdminRoute from '../../../components/Routes/AdminRoute';
import { Player } from '../../../types';

const UpdatePlayerContent = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const [formData, setFormData] = useState<any>({
    name: '', position: '', work: '', img: '', age: '', 
    height: '', weight: '', jersey: '', Birthdate: '', 
    DominantHand: 'Right', phone: '', facebook: '', instagram: '', whatsapp: ''
  });

  // GET Request
  const { data: players = [], isLoading } = useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: async () => {
      const res = await axiosSecure.get('/players');
      return res.data;
    }
  });

  // PATCH Request
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) => axiosSecure.patch(`/players/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      setEditingPlayer(null);
      resetForm();
      Swal.fire({
        title: 'Success!',
        text: 'Player updated successfully!',
        icon: 'success',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  });

  // DELETE Request
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosSecure.delete(`/players/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      Swal.fire({
        title: 'Deleted!',
        text: 'Player has been removed.',
        icon: 'success',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      background: '#0f172a',
      color: '#fff',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    updateMutation.mutate({ id: editingPlayer._id, updatedData: formData });
  };

  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setFormData({ ...player });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingPlayer(null);
    setFormData({
      name: '', position: '', work: '', img: '', age: '', height: '', weight: '', 
      jersey: '', Birthdate: '', DominantHand: 'Right', phone: '', facebook: '', 
      instagram: '', whatsapp: ''
    });
  };

  if (isLoading) return <p className="text-center text-white mt-10 text-xl font-bold">Loading players data...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen text-white">
      <h2 className="text-4xl font-extrabold text-center pb-2 mb-10 bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400">
        Player Management Dashboard
      </h2>

      {/* Edit Form */}
      {editingPlayer && (
        <div className="bg-[#0f172a] p-8 rounded-3xl shadow-2xl border border-white/10 mb-10">
          <h3 className="text-2xl font-bold mb-6 text-cyan-400">Updating: {editingPlayer.name}</h3>
          <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="position" value={formData.position} onChange={handleInputChange} placeholder="Position" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="work" value={formData.work || ''} onChange={handleInputChange} placeholder="Work" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="img" value={formData.img} onChange={handleInputChange} placeholder="Image URL" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} placeholder="Age" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="height" value={formData.height || ''} onChange={handleInputChange} placeholder="Height" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="weight" value={formData.weight || ''} onChange={handleInputChange} placeholder="Weight" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="jersey" value={formData.jersey} onChange={handleInputChange} placeholder="Jersey Number" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="Birthdate" value={formData.Birthdate || ''} onChange={handleInputChange} placeholder="Birthdate" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <select name="DominantHand" value={formData.DominantHand || 'Right'} onChange={handleInputChange} className="p-3 bg-slate-800 border border-white/10 rounded-xl">
              <option value="Right">Right Handed</option>
              <option value="Left">Left Handed</option>
            </select>
            <input name="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="Phone" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="facebook" value={formData.facebook || ''} onChange={handleInputChange} placeholder="Facebook URL" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="instagram" value={formData.instagram || ''} onChange={handleInputChange} placeholder="Instagram URL" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            <input name="whatsapp" value={formData.whatsapp || ''} onChange={handleInputChange} placeholder="WhatsApp URL" className="p-3 bg-slate-800 border border-white/10 rounded-xl" />
            
            <div className="md:col-span-3 flex gap-4 justify-end mt-4">
              <button type="button" onClick={resetForm} className="px-6 py-3 bg-slate-700 rounded-xl font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-8 py-3 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 text-slate-900 rounded-xl font-bold cursor-pointer">Update Player Info</button>
            </div>
          </form>
        </div>
      )}

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((player) => (
          <div key={player._id} className="bg-[#0f172a] p-6 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all shadow-lg">
            <div className="flex gap-4 items-center mb-6">
              <img src={player.img} alt={player.name} className="w-20 h-20 object-cover rounded-2xl" />
              <div>
                <h4 className="text-xl font-bold">{player.name}</h4>
                <p className="text-cyan-400 font-bold">Jersey {player.jersey}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditClick(player)} className="px-4 py-1.5 bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-600 transition cursor-pointer">Edit</button>
              <button onClick={() => handleDelete(player._id)} className="px-4 py-1.5 bg-red-900/50 text-red-400 rounded-lg text-xs font-bold hover:bg-red-900 transition cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function UpdatePlayerPage() {
  return (
    <AdminRoute>
      <UpdatePlayerContent />
    </AdminRoute>
  );
}
