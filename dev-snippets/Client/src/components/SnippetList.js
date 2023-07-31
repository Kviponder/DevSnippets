import React from 'react';

const SnippetList = ({ snippets }) => {
  return (
    <div>
      <h3>Snippet List</h3>
      <ul>
        {snippets.map((snippet) => (
          <li key={snippet.id}>
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
