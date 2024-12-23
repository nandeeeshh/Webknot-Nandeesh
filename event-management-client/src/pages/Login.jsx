import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      setToken(response.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Username" {...register('username')} margin="normal" />
        <TextField fullWidth label="Password" {...register('password')} type="password" margin="normal" />
        <Button variant="contained" color="primary" type="submit">Login</Button>
      </form>
    </Container>
  );
};

export default Login;
