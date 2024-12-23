import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Event Management</Typography>
        <Button color="inherit" onClick={() => navigate('/events')}>Events</Button>
        <Button color="inherit" onClick={() => navigate('/attendees')}>Attendees</Button>
        <Button color="inherit" onClick={() => navigate('/tasks')}>Tasks</Button>
        <Button color="inherit" onClick={() => navigate('/login')}>login</Button>
        <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
