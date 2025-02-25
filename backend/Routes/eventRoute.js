import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Fetch events based on role
router.get('/', async (req, res) => {
    try {
        const { id, role } = req.query;

        let query;
        let values = [];

        if (role === 'organizer') {
            query = 'SELECT * FROM event_details WHERE organizer_id = 57';
            values = [id];
        } else {
            query = 'SELECT * FROM event_details';
        }

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add an event
router.post('/', async (req, res) => {
    try {
        const { title, description, date, location, organizer_id } = req.body;
        const result = await pool.query(
            'INSERT INTO event_details (title, description, date, location, organizer_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, date, location, organizer_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update an event (only by the creator)
router.put('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { id, title, description, date, location } = req.body;

        const event = await pool.query('SELECT * FROM event_details WHERE id = $1', [eventId]);

        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.rows[0].organizer_id !== id) {
            return res.status(403).json({ message: 'Unauthorized to edit this event' });
        }

        await pool.query(
            'UPDATE event_details SET title = $1, description = $2, date = $3, location = $4 WHERE id = $5',
            [title, description, date, location, eventId]
        );

        res.json({ message: 'Event updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete an event (only by the creator)
router.delete('/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { id } = req.body;

        const event = await pool.query('SELECT * FROM event_details WHERE id = $1', [eventId]);

        if (event.rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.rows[0].organizer_id !== id) {
            return res.status(403).json({ message: 'Unauthorized to delete this event' });
        }

        await pool.query('DELETE FROM event_details WHERE id = $1', [eventId]);

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
