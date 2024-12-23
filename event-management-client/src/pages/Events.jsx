import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { getEvents, createEvent } from '../api/events';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { toast } from 'react-toastify';

const Events = () => {
  const { token } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents(token);
        setEvents(data);
      } catch (error) {
        toast.error('Failed to fetch events.');
      }
    };
    fetchEvents();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      await createEvent(data, token);
      toast.success('Event created successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to create event.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Events</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Event Name" {...register('name')} margin="normal" />
        <TextField fullWidth label="Date" type="date" {...register('date')} InputLabelProps={{ shrink: true }} margin="normal" />
        <TextField fullWidth label="Description" {...register('description')} margin="normal" />
        <TextField fullWidth label="Location" {...register('location')} margin="normal" />
        <Button variant="contained" color="primary" type="submit">Create Event</Button>
      </form>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.id}</TableCell>
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{event.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Events;
