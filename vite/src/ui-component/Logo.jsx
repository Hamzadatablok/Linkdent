import React from 'react';

const Logo = () => {
  return (
    <img 
      src="/logo.png" 
      alt="Linkdent CRM" 
      style={{ 
        width: '140px', 
        borderRadius: '10px',
        objectFit: 'contain'
      }} 
    />
  );
};

export default Logo;