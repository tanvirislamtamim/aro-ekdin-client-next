"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const socialPosts = [
  {
    id: 1,
    platform: 'instagram',
    image: 'https://images.unsplash.com/photo-1544691371-4471161af997?q=80&w=500',
    likes: '120',
    comments: '12',
    link: 'https://instagram.com/p/example1'
  },
  {
    id: 2,
    platform: 'facebook',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=500',
    likes: '250',
    comments: '45',
    link: 'https://facebook.com/example2'
  },
  {
    id: 3,
    platform: 'instagram',
    image: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=500',
    likes: '89',
    comments: '5',
    link: 'https://instagram.com/p/example3'
  },
  {
    id: 4,
    platform: 'facebook',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500',
    likes: '310',
    comments: '22',
    link: 'https://facebook.com/example4'
  }
];

const SocialFeed = () => {
  return (
    <section className="py-20 bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">
              Stay <span className="text-blue-500">Connected</span>
            </h2>
            <p className="text-gray-400 mt-2">Follow &quot;Aro Ekdin&quot; on social media for live updates.</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-gray-900 rounded-full hover:bg-blue-600 transition-all">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="p-3 bg-gray-900 rounded-full hover:bg-pink-600 transition-all">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {socialPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 0.98 }}
              className="relative group aspect-square overflow-hidden rounded-2xl bg-gray-800"
            >
              {/* Post Image */}
              <img 
                src={post.image} 
                alt="Social Post" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
                <div className="flex gap-6 mb-4">
                  <div className="flex items-center gap-1 font-bold">
                    <Heart size={20} className="fill-red-500 text-red-500" /> {post.likes}
                  </div>
                  <div className="flex items-center gap-1 font-bold">
                    <MessageCircle size={20} className="fill-white" /> {post.comments}
                  </div>
                </div>
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors cursor-pointer"
                >
                  View Post <ExternalLink size={14} />
                </a>
              </div>

              {/* Platform Icon Tag */}
              <div className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-lg">
                {post.platform === 'instagram' ? <FaInstagram size={16} /> : <FaFacebook size={16} />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 text-center">
          <button className="border border-gray-700 px-8 py-3 rounded-xl hover:bg-white hover:text-black transition-all font-semibold cursor-pointer">
            Load More Posts
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
