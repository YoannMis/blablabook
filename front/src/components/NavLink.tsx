import React from 'react';
import { Box } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router';

interface NavLinkProps {
  to: string;
  icon?: React.ReactNode;
  vertical?: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, vertical = false, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterLink to={to}>
      <Box
        display="flex"
        flexDirection={vertical ? 'column' : 'row'}
        alignItems="center"
        justifyContent="center"
        gap={2}
        color="white"
        fontWeight={isActive ? 'bold' : 'normal'}
        textDecoration={isActive ? 'wavy underline' : 'normal'}
      >
        {icon}
        {children}
      </Box>
    </RouterLink>
  );
};

export default NavLink;
