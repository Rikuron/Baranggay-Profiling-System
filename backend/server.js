const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // Import multer for storing of Announceent Images
const path = require('path'); // Import path for storing of Announceent Images
const fs = require('fs'); // For deleting of Announcement Images
const jwt = require('jsonwebtoken'); // For Staff user Authentication
const bcrypt = require('bcrypt'); // For hashing of passwords of Staff users

require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

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

const trackActivity = async (type, details) => {
  try {
    const activityId = `activity:${Date.now()}`;
    const activity = {
      id: activityId,
      type,
      ...details,
      createdAt: new Date().toISOString()
    };

    await client.hSet(activityId, Object.entries(activity).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));
  
    await client.sAdd('recent_activities', activityId);

    const activities = await client.sMembers('recent_activities');
    if (activities.length > 10) {
      const oldestActivity = activities[0];
      await client.sRem('recent_activities', oldestActivity);
      await client.del(oldestActivity);
    }
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
}










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
  
    await trackActivity('resident_create', {
      residentId: resident.residentId,
      residentName: resident.fullName
    });

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

    await trackActivity('resident_update', {
      residentId: residentId,
      residentName: updatedResident.fullName
    });

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

    await trackActivity('announcement_create', {
      announcementId: announcement.announcementId,
      announcementTitle: announcement.title
    });

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

    await trackActivity('announcement_update', {
      announcementId: updatedAnnouncement.announcementId,
      announcementTitle: updatedAnnouncement.title
    });

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

    await trackActivity('case_create', {
      caseId: newCase.caseId,
      caseName: newCase.caseName
    });

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

    await trackActivity('case_update', {
      caseId: updatedCase.caseId,
      caseName: updatedCase.caseName
    });

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

























// EVENTS CRUD
app.post('/events', async (req, res) => {
  try {
    const {
      eventId,
      eventTitle,
      location,
      date,
      time,
      category
    } = req.body;

    // Comprehensive input validation
    if (!eventId || !eventTitle || !location || !date || !time || !category ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate category
    const validCategories = ['Meeting', 'Community Event', 'Case Proceeding', 'Others'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        message: 'Invalid category', 
        validCategories: validCategories 
      });
    }

    // Check for existing event with the same ID
    const existingEvent = await client.hGetAll(`event:${eventId}`);
    if (Object.keys(existingEvent).length > 0) {
      return res.status(409).json({ error: 'Event ID already exists' });
    }

    // Prepare event object with creation timestamp
    const newEvent = {
      eventId,
      eventTitle,
      location,
      date,
      time,
      category,
      createdAt: new Date().toISOString(),
    };

    // Store event in Redis
    await client.hSet(`event:${eventId}`, Object.entries(newEvent).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));
    await client.sAdd('events', `event:${eventId}`);

    await trackActivity('event_create', {
      eventId: newEvent.eventId,
      eventTitle: newEvent.eventTitle
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Failed to add event', message: error.message });
  }
});

app.get('/events', async (req, res) => {
  try {
    const eventIds = await client.sMembers('events');
    const events = await Promise.all(
      eventIds.map(async (id) => {
        const eventData = await client.hGetAll(id);
        return eventData;
      })
    );

    // Sort events by creation or update time (most recent first)
    const sortedEvents = events.sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt;
      const dateB = b.updatedAt || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });

    res.status(200).json(sortedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events', message: error.message });
  }
});

app.get('/events/:id', async (req, res) => {
  try {
    const eventData = await client.hGetAll(`event:${req.params.id}`);

    if (Object.keys(eventData).length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(eventData);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event', message: error.message });
  }
});

app.put('/events/:id', async (req, res) => {
  try {
    const {
      eventTitle,
      location,
      date,
      time,
      category
    } = req.body;
    const eventId = req.params.id;

    const existingEvent = await client.hGetAll(`event:${eventId}`);
    if (Object.keys(existingEvent).length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['Meeting', 'Community Event', 'Case Proceeding', 'Others'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          message: 'Invalid category', 
          validCategories: validCategories 
        });
      }
    }

    const updatedEvent = {
      eventId: existingEvent.eventId,
      eventTitle: eventTitle || existingEvent.eventTitle,
      location: location || existingEvent.location,
      date: date || existingEvent.date,
      time: time || existingEvent.time,
      category: category || existingEvent.category,
      createdAt: existingEvent.createdAt,
      updatedAt: new Date().toISOString()
    };

    await client.hSet(`event:${eventId}`, Object.entries(updatedEvent).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));

    await trackActivity('event_update', {
      eventId: updatedEvent.eventId,
      eventTitle: updatedEvent.eventTitle
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event', message: error.message });
  }
});

app.delete('/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const fullEventKey = `event:${eventId}`;

    // Verify event exists before deletion
    const existingEvent = await client.hGetAll(fullEventKey);
    if (Object.keys(existingEvent).length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await client.del(fullEventKey);
    await client.sRem('events', fullEventKey);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event', message: error.message });
  }
});



























// STAFF USERS CRUD / METHODS

const ADMIN_KEY = process.env.ADMIN_KEY || 'eugenio<3'; 
const saltRounds = 10; // For bcrypt password hashing

app.post('/staff', async (req, res) => {
  try {
    const { 
      staffId, 
      fullName, 
      position, 
      contactNumber, 
      email, 
      username, 
      password 
    } = req.body;
  
    // Validate input fields
    if (!staffId || !fullName || !position || !contactNumber || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Check if staff ID or username already exists
    const existingStaff = await client.hGetAll(`staff:${staffId}`);
    const existingUsername = await client.hGet('staff:usernames', username);
    
    if (Object.keys(existingStaff).length > 0) {
      return res.status(409).json({ error: 'Staff ID already exists' });
    }
    
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already exists' });
    }
  
    // Determine admin status based on password
    const isAdmin = password === ADMIN_KEY;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const staff = {
      staffId,
      fullName,
      position,
      contactNumber,
      email,
      username,
      password: hashedPassword,
      isAdmin: isAdmin.toString(),
      createdAt: new Date().toISOString()
    };
          
    // Store staff in Redis
    await client.hSet(`staff:${staffId}`, Object.entries(staff).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));
    await client.sAdd('staff', `staff:${staffId}`);
    
    // Store username for unique check
    await client.hSet('staff:usernames', username, staffId);
  
    res.status(201).json({ 
      message: 'Staff added successfully', 
      staff: {
        staffId,
        fullName,
        position,
        contactNumber,
        email,
        username,
        isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add staff', message: error.message });
  }
});

app.get('/staff', async (req, res) => {
  try {
    const staffIds = await client.sMembers('staff');
    const staff = await Promise.all(
      staffIds.map(async (id) => {
        const staffMember = await client.hGetAll(id);
        // Remove sensitive information before sending
        delete staffMember.password;
        return staffMember;
      })
    );

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff', message: error.message });
  }
});

app.get('/staff/:id', async (req, res) => {
  try {
    const staffMember = await client.hGetAll(`staff:${req.params.id}`);

    if (Object.keys(staffMember).length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Remove sensitive information before sending
    delete staffMember.password;
    res.json(staffMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff member', message: error.message });
  }
});

app.put('/staff/:id', async (req, res) => {
  try {
    const {
      fullName,
      position,
      contactNumber,
      email,
      username,
      password
    } = req.body;
    const staffId = req.params.id;

    const existingStaff = await client.hGetAll(`staff:${staffId}`);
    if (Object.keys(existingStaff).length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Check if new username is already taken (except by current user)
    if (username && username !== existingStaff.username) {
      const existingUsername = await client.hGet('staff:usernames', username);
      if (existingUsername) {
        return res.status(409).json({ error: 'Username already exists' });
      }
    }

    // Determine admin status
    const isAdmin = password ? (password === ADMIN_KEY) : (existingStaff.isAdmin === 'true');
    
    // Hash new password if provided
    const hashedPassword = password 
      ? await bcrypt.hash(password, saltRounds) 
      : existingStaff.password;

    const updatedStaff = {
      staffId: existingStaff.staffId,
      fullName: fullName || existingStaff.fullName,
      position: position || existingStaff.position,
      contactNumber: contactNumber || existingStaff.contactNumber,
      email: email || existingStaff.email,
      username: username || existingStaff.username,
      password: hashedPassword,
      isAdmin: isAdmin.toString(),
      createdAt: existingStaff.createdAt,
      updatedAt: new Date().toISOString()
    };

    // Remove old username if changed
    if (username && username !== existingStaff.username) {
      await client.hDel('staff:usernames', existingStaff.username);
      await client.hSet('staff:usernames', username, staffId);
    }

    await client.hSet(`staff:${staffId}`, Object.entries(updatedStaff).reduce((acc, [key, value]) => {
      acc[key] = value || '';
      return acc;
    }, {}));

    res.json({
      staffId,
      fullName: updatedStaff.fullName,
      position: updatedStaff.position,
      contactNumber: updatedStaff.contactNumber,
      email: updatedStaff.email,
      username: updatedStaff.username,
      isAdmin
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff member', message: error.message });
  }
});

app.delete('/staff/:id', async (req, res) => {
  try {
    const staffId = req.params.id;
    const fullStaffKey = `staff:${staffId}`;

    // Fetch existing staff to get username for removal
    const existingStaff = await client.hGetAll(fullStaffKey);
    if (Object.keys(existingStaff).length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Remove username from unique username tracking
    await client.hDel('staff:usernames', existingStaff.username);

    await client.del(fullStaffKey);
    await client.sRem('staff', fullStaffKey);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff member', message: error.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find staff member by username
    const staffId = await client.hGet('staff:usernames', username);
    if (!staffId) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Get full staff details
    const staff = await client.hGetAll(`staff:${staffId}`);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, staff.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        staffId: staff.staffId, 
        username: staff.username, 
        isAdmin: staff.isAdmin === 'true' 
      }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      staffId: staff.staffId,
      username: staff.username,
      isAdmin: staff.isAdmin === 'true'
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});









// Recent Activities
app.get('/recent-activities', async (req, res) => {
  try {
    const activityIds = await client.sMembers('recent_activities');

    const activities = await Promise.all(
      activityIds
        .map(async (id) => await client.hGetAll(id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );

    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activities', message: error.message });
  }
})

// Upcoming Events
app.get('/upcoming-events', async(req, res) => {
  try {
    const eventIds = await client.sMembers('events');
    const events = await Promise.all(
      eventIds.map(async (id) => {
        const eventData = await client.hGetAll(id);
        return eventData;
      })
    );

    const currentDate = new Date();
    const upcomingEvents = events 
      .filter(event => {
        const eventDate = new Date(`${event.date}T${event.time}`);
        return eventDate > currentDate;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
      })
      .slice(0, 3);

      res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming events', message: error.message });
  }
})
























app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
