import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactList from '../components/ContactList';
import Pagination from '../components/Pagination';

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch contacts for the current page
    fetchContacts(currentPage);
  }, [currentPage]);

  const fetchContacts = async (page) => {
    try {
      const response = await axios.get(`/api/contacts?page=${page}`);
      setContacts(response.data.contacts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <ContactList contacts={contacts} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Home;
