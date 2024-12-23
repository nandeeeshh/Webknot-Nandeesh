import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { getTasks, createTask, updateTaskStatus } from '../api/tasks';
import { getEvents } from '../api/events';  
import { getAttendees } from '../api/attendees';  
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { toast } from 'react-toastify';

const Tasks = () => {
  const { token } = useContext(AuthContext);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedAttendeeId, setSelectedAttendeeId] = useState('');


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data); 
      } catch (error) {
        toast.error('Failed to fetch events.');
      }
    };
    fetchEvents();
  }, []);


  useEffect(() => {
    if (selectedEventId) {
      const fetchTasks = async () => {
        try {
          const data = await getTasks(selectedEventId, token);
          setTasks(data); 
        } catch (error) {
          toast.error('Failed to fetch tasks.');
        }
      };
      fetchTasks();
    }
  }, [selectedEventId, token]);


  useEffect(() => {
    if (selectedEventId) {
      const fetchAttendees = async () => {
        try {
          const data = await getAttendees();
          setAttendees(data);
        } catch (error) {
          toast.error('Failed to fetch attendees.');
        }
      };
      fetchAttendees();
    }
  }, [selectedEventId]);


  const onSubmit = async (data) => {
    try {
      await createTask({ ...data, event_id: selectedEventId, attendee_id: selectedAttendeeId }, token);
      toast.success('Task added successfully!');
      reset();
      setTasks((prev) => [...prev, { ...data, event_id: selectedEventId, attendee_id: selectedAttendeeId }]); // Optimistic UI update
    } catch (error) {
      toast.error('Failed to add task.');
    }
  };


  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus, token);
      toast.success('Task status updated!');
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      toast.error('Failed to update task status.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Tasks</Typography>

      {/* Event Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Event</InputLabel>
        <Select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          label="Event"
        >
          {events.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Attendee Selection */}
      {selectedEventId && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Attendee</InputLabel>
          <Select
            value={selectedAttendeeId}
            onChange={(e) => setSelectedAttendeeId(e.target.value)}
            label="Attendee"
          >
            {attendees.map((attendee) => (
              <MenuItem key={attendee.id} value={attendee.id}>
                {attendee.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Task Creation Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Task Title" {...register('name')} margin="normal" />
        <TextField fullWidth label="Due Date" type="date" {...register('deadline')} InputLabelProps={{ shrink: true }} margin="normal" />
        <TextField fullWidth label="Status" {...register('status')} margin="normal" />
        <Button variant="contained" color="primary" type="submit">Add Task</Button>
      </form>

      {/* Task List */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleStatusChange(task.id, task.status === 'Pending' ? 'Completed' : 'Pending')}
                >
                  {task.status === 'Pending' ? 'Mark as Completed' : 'Mark as Pending'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Tasks;
