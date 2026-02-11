'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { role, logout } = useAuth();
  const router = useRouter();




  useEffect(() => {
    
    if (!role) {
      router.push('/admin/login/admin');
    }
  }, [role, router]);

  const handleLogout = () => {
    logout();
    router.replace('/admin/login/admin');
  };




  const menuItems = [
    { id: '1', icon: 'person-outline' as const, label: 'Personal Information', color: '#7B1F1F', bg: 'bg-primary/10' },
    { id: '2', icon: 'time-outline' as const, label: 'Shift Schedule', color: '#f43f5e', bg: 'bg-accent/10' },
    { id: '3', icon: 'settings-outline' as const, label: 'Settings', color: '#64748b', bg: 'bg-slate-100' },
    { id: '4', icon: 'help-circle-outline' as const, label: 'Help & Support', color: '#C8A951', bg: 'bg-success-light' },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col font-sans">
      {/* Header Section */}
      <div className="relative bg-primary py-12 md:py-16 shadow-2xl overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex justify-between items-center">
             <div className="flex items-center">
                <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center overflow-hidden mr-6 shadow-xl">
                   <div className="w-full h-full bg-red-800 flex items-center justify-center">
                      <Icon name="person" size={40} color="white" />
                   </div>
                </div>
                <div>
                    <h1 className="text-4xl font-serif text-white mb-1 tracking-tight drop-shadow-md">
                      John Doe
                    </h1>
                    <div className="flex items-center gap-3">
                        <p className="text-gold text-sm font-medium tracking-wider uppercase opacity-90">
                          {role || 'Staff'} Member
                        </p>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">ACTIVE NOW</span>
                    </div>
                </div>
             </div>
             

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 -mt-10 relative z-20">
         <div className="bg-white rounded-[40px] shadow-card border border-white/50 p-8 md:p-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                 {/* Menu Options */}
                 <div className="col-span-1 md:col-span-2 space-y-4">
                     <h3 className="text-xl font-serif text-slate-900 mb-6">Account Settings</h3>
                     {menuItems.map((item) => (
                        <button
                          key={item.id}
                          className="w-full bg-white border border-slate-100 rounded-2xl p-6 flex items-center hover:shadow-lg hover:border-primary/20 transition-all group"
                        >
                          <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                            <Icon name={item.icon} size={24} color={item.color} />
                          </div>
                          <div className="flex-1 text-left">
                              <span className="text-slate-900 font-bold text-lg group-hover:text-primary transition-colors">{item.label}</span>
                              <p className="text-slate-400 text-sm">Manage your {item.label.toLowerCase()}</p>
                          </div>
                          <Icon name="chevron-forward" size={24} color="#cbd5e1" className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                 </div>
             </div>

             <div className="border-t border-slate-100 pt-8 flex justify-between items-center">
                 <div className="text-left">
                      <p className="text-slate-900 font-bold text-sm">RestaurantOS Identity</p>
                      <p className="text-slate-400 text-xs mt-1">v2.5.0 • Enterprise Edition</p>
                 </div>
                 <button
                    className="bg-red-50 text-red-600 border border-red-100 px-8 py-4 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center"
                    onClick={handleLogout}
                  >
                    <Icon name="log-out-outline" size={20} color="#dc2626" className="mr-2" />
                    Sign Out
                  </button>
             </div>
         </div>
      </div>
    </div>
  );
}
