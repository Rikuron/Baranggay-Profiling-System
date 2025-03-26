const express = require('express');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const ADMIN_KEY = process.env.ADMIN_KEY || 'eugenio<3';

// Connect to Redis
const client = redis.createClient({
  url: 'redis://@127.0.0.1:6380'  // Default Redis connection
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

client.connect()
  .then(() => console.log('Connected to Redis'))
  .catch(err => console.error('Redis connection error:', err));












// RESIDENTS CRUD
app.post('/residents', async (req, res) => {
  try {
    const { 
      residentId , 
      fullName, 
      birthdate, 
      gender, 
      contactNumber, 
      address, 
      maritalStatus, 
      occupation 
    } = req.body;
  
    // Validate input fields
    if (!residentId || !fullName || !birthdate || !gender || !contactNumber || !address || !maritalStatus || !occupation) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const existingResident = await client.hGetAll(`resident:${residentId}`);
    if (Object.keys(existingResident).length > 0) {
      return res.status(409).json({ error: 'Resident ID already exists' });
    }
  
    const resident = {
      residentId,
      fullName,
      birthdate,
      gender,
      contactNumber,
      address,
      maritalStatus,
      occupation,
      createdAt: new Date().toISOString()
    };
          
    // Store resident in Redis
    await client.hSet(`resident:${residentId}`, Object.entries(resident).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));
    await client.sAdd('residents', `resident:${residentId}`);
  
    res.status(201).json({ message: 'Resident added successfully', resident });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add resident', message: error.message });
  }
});

app.get('/residents', async (req, res) => {
  try {
    const residentIds = await client.sMembers('residents');
    const residents = await Promise.all(
      residentIds.map(async (id) => {
        const resident = await client.hGetAll(id);
        return resident;
      })
    );

    res.status(200).json(residents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch residents', message: error.message });
  }
});

app.get('/residents/:id', async (req, res) => {
  try {
    const resident = await client.hGetAll(`resident:${req.params.id}`);

    if (Object.keys(resident).length === 0) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    res.json(resident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resident', message: error.message });
  }
})

app.put('/residents/:id', async (req, res) => {
  try {
    const {
      fullName,
      birthdate,
      gender,
      contactNumber,
      address,
      maritalStatus,
      occupation
    } = req.body;
    const residentId = req.params.id;

    const existingResident = await client.hGetAll(`resident:${residentId}`);
    if (Object.keys(existingResident).length === 0) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    const updatedResident = {
      residentId: existingResident.residentId,
      fullName,
      birthdate,
      gender,
      contactNumber,
      address,
      maritalStatus,
      occupation,
      updatedAt: new Date().toISOString()
    };

    await client.hSet(`resident:${residentId}`, Object.entries(updatedResident).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    } ,{}));

    res.json(updatedResident);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update resident', message: error.message });
  }
});

app.delete('/residents/:id', async (req, res) => {
  try {
    const residentId = `resident:${req.params.id}`;


    await client.del(residentId);
    await client.sRem('residents', residentId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resident', message: error.message });
  }
});











// ANNOUNCEMENTS CRUD

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/announcements/');
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

app.post('/announcements', upload.single('image'), async (req, res) => {
  try {
    const {
      announcementId,
      title,
      description,
    } = req.body;

    if (!announcementId || !title || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAnnouncement = await client.hGetAll(`announcement:${announcementId}`);
    if (Object.keys(existingAnnouncement).length > 0) {
      return res.status(409).json({ error: 'Announcement ID already exists' });
    }

    const announcement = {
      announcementId,
      title,
      description,
      image: req.file ? req.file.path : '',
      dateTimePosted: new Date().toISOString()
    };

    await client.hSet(`announcement:${announcementId}`, Object.entries(announcement).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));
    await client.sAdd('announcements', `announcement:${announcementId}`);

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add announcement', message: error.message });
  }
});

app.get('/announcements', async (req, res) => {
  try {
    const announcementIds = await client.sMembers('announcements');
    const announcements = await Promise.all(
      announcementIds.map(async (id) => {
        const announcement = await client.hGetAll(id);
        return announcement;
      })
    );

    const sortedAnnouncements = announcements.sort((a, b) => {
      const dateA = a.updatedAt || a.dateTimePosted;
      const dateB = b.updatedAt || b.dateTimePosted;

      return new Date(dateB) - new Date(dateA);
    });

    res.json(sortedAnnouncements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcements', message: error.message });
  }
});

app.get('/announcements/:id', async (req, res) => {
  try {
    const announcement = await client.hGetAll(`announcement:${req.params.id}`);

    if (Object.keys(announcement).length === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch announcement', message: error.message });
  }
});

app.put('/announcements/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const announcementId = req.params.id;

    const existingAnnouncement = await client.hGetAll(`announcement:${announcementId}`);
    if (Object.keys(existingAnnouncement).length === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const updatedAnnouncement = {
      announcementId: existingAnnouncement.announcementId,
      title: title || existingAnnouncement.title ,
      description: description || existingAnnouncement.description,
      image: req.file ? req.file.path : existingAnnouncement.image,
      dateTimePosted: existingAnnouncement.dateTimePosted,
      updatedAt: new Date().toISOString(),
      updateCount: parseInt(existingAnnouncement.updateCount || 0) + 1
    };

    await client.hSet(`announcement:${announcementId}`, Object.entries(updatedAnnouncement).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));

    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement', message: error.message });
  }
});

app.delete('/announcements/:id', async (req, res) => {
  try {
    const announcementId = `announcement:${req.params.id}`;
    const fullAnnouncementKey = `announcement:${announcementId}`;

    const existingAnnouncement = await client.hGetAll(fullAnnouncementKey);

    if(existingAnnouncement.image) {
      try {
        fs.unlinkSync(existingAnnouncement.image);
      } catch (fileError) {
        console.warn('Could not delete image file: ', fileError);
      }
    }

    await client.del(announcementId);
    await client.sRem('announcements', announcementId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete announcement', message: error.message });
  }
});











// CASES CRUD
app.post('/cases', async (req, res) => {
  try {
    const {
      caseId,
      caseName,
      caseType,
      caseStatus,
      complainantName,
      dateFiled
    } = req.body;

    // Comprehensive input validation
    if (!caseId || !caseName || !caseType || !caseStatus || !complainantName || !dateFiled) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing case with the same ID
    const existingCase = await client.hGetAll(`case:${caseId}`);
    if (Object.keys(existingCase).length > 0) {
      return res.status(409).json({ error: 'Case ID already exists' });
    }

    // Prepare case object with creation timestamp
    const newCase = {
      caseId,
      caseName,
      caseType,
      caseStatus,
      complainantName,
      dateFiled,
      createdAt: new Date().toISOString(),
    };

    // Store case in Redis
    await client.hSet(`case:${caseId}`, Object.entries(newCase).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));
    await client.sAdd('cases', `case:${caseId}`);

    res.status(201).json(newCase);
  } catch (error) {
    console.error('Error adding case:', error);
    res.status(500).json({ error: 'Failed to add case', message: error.message });
  }
});

app.get('/cases', async (req, res) => {
  try {
    const caseIds = await client.sMembers('cases');
    const cases = await Promise.all(
      caseIds.map(async (id) => {
        const caseData = await client.hGetAll(id);
        return caseData;
      })
    );

    // Sort cases by creation or update time (most recent first)
    const sortedCases = cases.sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt;
      const dateB = b.updatedAt || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });

    res.status(200).json(sortedCases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases', message: error.message });
  }
});

app.get('/cases/:id', async (req, res) => {
  try {
    const caseData = await client.hGetAll(`case:${req.params.id}`);

    if (Object.keys(caseData).length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.json(caseData);
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({ error: 'Failed to fetch case', message: error.message });
  }
});

app.put('/cases/:id', async (req, res) => {
  try {
    const {
      caseName,
      caseType,
      caseStatus,
      complainantName,
      dateFiled
    } = req.body;
    const caseId = req.params.id;

    const existingCase = await client.hGetAll(`case:${caseId}`);
    if (Object.keys(existingCase).length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const updatedCase = {
      caseId: existingCase.caseId,
      caseName: caseName || existingCase.caseName,
      caseType: caseType || existingCase.caseType,
      caseStatus: caseStatus || existingCase.caseStatus,
      complainantName: complainantName || existingCase.complainantName,
      dateFiled: dateFiled || existingCase.dateFiled,
      createdAt: existingCase.createdAt,
      updatedAt: new Date().toISOString()
    };

    await client.hSet(`case:${caseId}`, Object.entries(updatedCase).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));

    res.json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ error: 'Failed to update case', message: error.message });
  }
});

app.delete('/cases/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const fullCaseKey = `case:${caseId}`;

    // Verify case exists before deletion
    const existingCase = await client.hGetAll(fullCaseKey);
    if (Object.keys(existingCase).length === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    await client.del(fullCaseKey);
    await client.sRem('cases', fullCaseKey);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({ error: 'Failed to delete case', message: error.message });
  }
});











app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
