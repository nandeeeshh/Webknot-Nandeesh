import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { registerr } from '../api/auth';

const Register = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();


  const onSubmit = async (data) => {
    try {

      const response = await registerr(data);
        toast.success('Registered successfully!, Please login');
        setSuccess('User registered successfully!');
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h5">Register</Typography>
        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                {...register('username', { required: 'Username is required' })}
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
              />
            </Grid> */}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 3 }}
            disabled={!!errors.username || !!errors.password || !!errors.confirmPassword}
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;
