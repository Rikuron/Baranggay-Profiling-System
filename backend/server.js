const express = require('express');
const multer = require('multer'); // Import multer
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }); // Set up multer for file uploads

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6380'  // Default Redis connection
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));

const ADMIN_KEY = process.env.ADMIN_KEY || 'eugenio<3';

app.post('/residents', async (req, res) => {
  const { residentId , fullName, birthdate, gender, contactNumber, address, maritalStatus, occupation } = req.body;

  // Validate input fields
  if (!residentId || !fullName || !birthdate || !gender || !contactNumber || !address || !maritalStatus || !occupation) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create resident object
    const resident = {
      residentId,
      fullName,
      birthdate,
      gender,
      contactNumber,
      address,
      maritalStatus,
      occupation
    };
        
    // Store resident in Redis
    await client.hSet(`resident:${resident.residentId}`, resident);

    res.status(201).json({ message: 'Resident added successfully', resident });

  } catch (error) {
    console.error('Error registering Resident: ', error);
    res.status(500).json({ message: 'Failed to register Resident' });
  }
});

app.get('/residents/:id', async (req, res) => {
  const id = req.params.res;
  const resident = await client.hGetAll(`resident:${residentId}`);
  if (Object.keys(resident).length === 0) {
    return res.status(404).json({ message: 'Resident not found' });
  }
  res.json(resident);
})

app.get('/residents', async (req, res) => {
  const keys = await client.keys('resident:*');
  const residents = await Promise.all(keys.map(async (key) => {
    return { residentId: key.split(':')[1], ...(await client.hGetAll(key)) };
  }));

  res.status(200).json(residents);
});

app.put('/residents/:id', async (req, res) => {
  const id = req.params.residentId;
  const { fullName, birthdate, gender, contactNumber, address, maritalStatus, occupation } = req.body;

  // Validate input fields
  if (!fullName && !birthdate && !gender && !contactNumber && !address && !maritalStatus && !occupation) {
    return res.status(400).json({ message: 'At least one field is required to update' });
  }

  try {
    const existingResident = await client.hGetAll(`resident:${id}`);
    if (Object.keys(existingResident).length === 0) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Update resident data in Redis
    if (fullName) await client.hSet(`resident:${id}`, 'fullName', fullName);
    if (birthdate) await client.hSet(`resident:${id}`, 'birthdate', birthdate);
    if (gender) await client.hSet(`resident:${id}`, 'gender', gender);
    if (contactNumber) await client.hSet(`resident:${id}`, 'contactNumber', contactNumber);
    if (address) await client.hSet(`resident:${id}`, 'address', address);
    if (maritalStatus) await client.hSet(`resident:${id}`, 'maritalStatus', maritalStatus);
    if (occupation) await client.hSet(`resident:${id}`, 'occupation', occupation);

    res.status(200).json({ message: 'Resident updated successfully' });
  } catch (error) {
    console.error('Error updating resident:', error);
    res.status(500).json({ message: 'Failed to update resident' });
  }
});

app.delete('/residents/:id', async (req, res) => {
  const id = req.params.residentId;
  await client.del(`resident:${id}`);
  res.status(200).json({ message: 'Resident deleted successfully' });
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

});

// Announcement posting endpoint
app.post('/announcements', upload.single('image'), async (req, res) => {
  const { announcementId, title, description } = req.body;
  const dateTimePosted = new Date().toISOString();

  // Log incoming request data
  console.log('Incoming announcement data:', req.body);

  // Validate input fields
  if (!announcementId || !title || !description) {
    return res.status(400).json({ message: 'Announcement ID, title, and description are required' });
  }

  try {
    // Check if the announcement ID already exists
    const existingAnnouncement = await client.hGetAll(`announcement:${announcementId}`);
    if (Object.keys(existingAnnouncement).length > 0) {
      return res.status(400).json({ message: 'Announcement ID already exists' });
    }

    // Create announcement object
    const announcement = {
      announcementId,
      title,
      description,
      image: req.file ? req.file.buffer : null, // Handle image buffer
      dateTimePosted
    };

    // Store announcement in Redis
    await client.hSet(`announcement:${announcementId}`, announcement);
    res.status(201).json({ message: 'Announcement posted successfully', announcement });

  } catch (error) {
    console.error('Error posting announcement: ', error);
    res.status(500).json({ message: 'Failed to post announcement' });
  }
});

app.get('/announcements', async (req, res) => {
  const keys = await client.keys('announcement:*');
  const announcements = await Promise.all(keys.map(async (key) => {
    return { announcementId: key.split(':')[1], ...(await client.hGetAll(key)) };
  }));

  res.status(200).json(announcements);
});

app.get('/announcements/:id', async (req, res) => {
  const id
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
