import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  borderColor: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, borderColor }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-neutral-800 mt-1">{value}</p>
        </div>
        <div className="text-neutral-300">
            {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;