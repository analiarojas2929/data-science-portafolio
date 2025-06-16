import React from 'react';
import { FaPython, FaDatabase, FaChartLine, FaRegFileCode } from 'react-icons/fa';

const SkillIcon = ({ skill }) => {
    const icons = {
        Python: <FaPython className="text-4xl text-blue-500" />,
        SQL: <FaDatabase className="text-4xl text-green-500" />,
        Pandas: <FaChartLine className="text-4xl text-purple-500" />,
        NumPy: <FaRegFileCode className="text-4xl text-red-500" />,
        Matplotlib: <FaChartLine className="text-4xl text-orange-500" />,
        'Scikit-learn': <FaRegFileCode className="text-4xl text-yellow-500" />,
    };

    return (
        <div className="flex flex-col items-center">
            {icons[skill] || <span className="text-4xl">⚙️</span>}
            <span className="mt-2 text-lg font-semibold">{skill}</span>
        </div>
    );
};

export default SkillIcon;