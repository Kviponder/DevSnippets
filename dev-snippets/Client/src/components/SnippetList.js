import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME, ADD_SNIPPET, DELETE_SNIPPET, UPDATE_SNIPPET } from '../utils/queries';
import { Alert, Button } from 'react-bootstrap'; // Import Alert and Button from react-bootstrap
import '../styles.css'; // Import the styles.css file

const SnippetList = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data ? data.me : {};
  const user = userData;
  const snippets = user ? user.snippets || [] : [];

  const [currentAction, setCurrentAction] = useState(null); // "add", "update", or null
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    code: '',
  });

  const [addSnippet] = useMutation(ADD_SNIPPET, {
    update(cache, { data: { addSnippet } }) {
      cache.modify({
        fields: {
          me(existingRef = []) {
            return [...existingRef, addSnippet];
          },
        },
      });
    },
  });

  const [deleteSnippet] = useMutation(DELETE_SNIPPET, {
    update(cache, { data: { deleteSnippet } }) {
      cache.modify({
        fields: {
          me(existingRef = [], { readField }) {
            return existingRef.filter((ref) => readField('_id', ref) !== deleteSnippet._id);
          },
        },
      });
    },
  });

  const [updateSnippet] = useMutation(UPDATE_SNIPPET);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSnippet = () => {
    setCurrentAction('add');
    setFormData({
      title: '',
      description: '',
      language: '',
      code: '',
    });
  };

  const handleEditSnippet = (snippet) => {
    setCurrentAction('update');
    setFormData({
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      code: snippet.code,
    });
  };

  const handleDeleteSnippet = (snippetId) => {
    deleteSnippet({
      variables: { snippetId },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (currentAction === 'add') {
      addSnippet({
        variables: { ...formData },
      });
    } else if (currentAction === 'update') {
      updateSnippet({
        variables: { snippetId: snippets[0]._id, ...formData }, // Assuming you want to update the first snippet in the list
      });
    }

    setCurrentAction(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="snippet-list">
      <h3>My Snippets</h3>
      {snippets.length === 0 ? (
        <Alert variant="info">You haven't added any snippets yet.</Alert>
      ) : (
        <ul>
          {snippets.map((snippet) => (
            <li key={snippet._id} className="snippet-item">
              <h4>{snippet.title}</h4>
              <p>{snippet.description}</p>
              <p>Language: {snippet.language}</p>
              <p>Code:</p>
              <pre>{snippet.code}</pre>
              <Button variant="primary" onClick={() => handleEditSnippet(snippet)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => handleDeleteSnippet(snippet._id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new snippet form */}
      {currentAction === 'add' && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="language">Language</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="code">Code</label>
            <textarea name="code" value={formData.code} onChange={handleInputChange} />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      )}

      {/* Button to add a new snippet */}
      <Button variant="success" onClick={handleAddSnippet}>
        Add Snippet
      </Button>
    </div>
  );
};

export default SnippetList;
