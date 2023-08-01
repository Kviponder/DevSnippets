import React from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

const SnippetList = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data || {};
  const snippets = userData.me ? userData.me.snippets : [];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Snippet List</h3>
      <ul>
        {snippets.map((snippet) => (
          <li key={snippet._id}>
            <h4>{snippet.title}</h4>
            <p>{snippet.description}</p>
            {/* Add other details you want to display for each snippet */}
            <p>Language: {snippet.language}</p>
            <p>Code:</p>
            <pre>{snippet.code}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SnippetList;