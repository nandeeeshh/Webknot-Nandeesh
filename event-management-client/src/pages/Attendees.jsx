import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { getAttendees, createAttendee, deleteAttendee } from '../api/attendees';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { toast } from 'react-toastify';
import { getEvents } from '../api/events'; 

const Attendees = () => {
  const { token } = useContext(AuthContext);
  const { register, handleSubmit, reset } = useForm();
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]); 


  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const data = await getAttendees(token);
        setAttendees(data);
      } catch (error) {
        toast.error('Failed to fetch attendees.');
      }
    };
    fetchAttendees();
  }, [token]);


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
      await createAttendee(data, token);
      toast.success('Attendee added successfully!');
      reset();
      setAttendees((prev) => [...prev, data]); 
    } catch (error) {
      toast.error('Failed to add attendee.');
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await deleteAttendee(eventId); 
      setAttendees((prev) => prev.filter(attendee => attendee.event_id !== eventId)); 
      toast.success('Attendee deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete attendee.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Attendees</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Name" {...register('name')} margin="normal" />
        <TextField fullWidth label="Email" {...register('email')} margin="normal" />

        {/* Dropdown for selecting an event */}
        <TextField
          select
          fullWidth
          label="Event"
          {...register('event_id')}
          margin="normal"
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </TextField>

        <Button variant="contained" color="primary" type="submit">Add Attendee</Button>
      </form>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Event</TableCell> {/* Added event column */}
            <TableCell>Actions</TableCell> {/* Added Actions column for Delete button */}
          </TableRow>
        </TableHead>
        <TableBody>
          {attendees.map((attendee, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{attendee.name}</TableCell>
              <TableCell>{attendee.email}</TableCell>
              <TableCell>{attendee.event_id}</TableCell> {/* Display event ID */}
              <TableCell>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDelete(attendee.event_id)} 
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Attendees;
