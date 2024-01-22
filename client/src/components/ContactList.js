// ContactList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactList.css'; // Import the CSS file

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);

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
        setCurrentPage(1); // Reset to the first page after upload
      } catch (error) {
        console.error('Error uploading CSV file:', error.message);
      }
    }
  };

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const totalPageCount = Math.ceil(contacts.length / contactsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPageCount) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="contact-list-container">
      <div >
        <button className="import-button"><input type="file" accept=".csv" onChange={handleFileUpload} /></button>
      </div>
      <table>
        <thead>
          <tr>
            <th>□</th>
            <th>Name</th>
            <th>Email ID</th>
            <th>Phone No</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.map((contact) => (
            <tr key={contact._id}>
              <td>□</td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-section">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          {currentPage} - {totalPageCount}
        </span>
        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastContact >= contacts.length}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ContactList;
