// ContactList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await axios.post('http://localhost:3000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Refresh contact list after successful upload
        fetchContacts();
      } catch (error) {
        console.error('Error uploading CSV file:', error.message);
      }
    }
  };
  const mystyle = {
    top:"10px",
    right:"10px"
  };

  return (
    <div>
      <div style={{mystyle}}>
      <input  type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      <ul>
        
        {contacts.map((contact) => (
          <li key={contact._id}>
            {contact.name} - {contact.email} - {contact.phoneNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
