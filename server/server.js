// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

// Connect to MongoDB (replace 'your_database' with your actual database name)
mongoose.connect('mongodb://localhost/your_database', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a mongoose schema for the contact model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
});

// Create a mongoose model for the 'Contact' collection
const Contact = mongoose.model('Contact', contactSchema);

// Enable CORS for all routes
app.use(cors());

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API route for fetching contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route for handling file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  // Access the uploaded file using req.file
  const uploadedFile = req.file;

  // Process the file as a CSV and save data to MongoDB
  if (uploadedFile) {
    const data = [];
    const stream = csv()
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', async () => {
        // Save data to MongoDB
        try {
          await Contact.insertMany(data);
          console.log('Data saved to MongoDB');
          res.send('File uploaded and data saved successfully');
        } catch (error) {
          console.error('Error saving data to MongoDB:', error.message);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

    stream.write(uploadedFile.buffer.toString());
    stream.end();
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
