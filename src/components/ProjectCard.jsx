import React from 'react';

const ProjectCard = ({ title, description, tools, link }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 m-4 transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700 mb-2">{description}</p>
            <p className="text-gray-500 mb-2"><strong>Tools:</strong> {tools.join(', ')}</p>
            <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
            >
                View Project
            </a>
        </div>
    );
};

export default ProjectCard;