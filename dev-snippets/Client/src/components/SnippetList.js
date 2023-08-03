import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  QUERY_ME,
  ADD_SNIPPET,
  DELETE_SNIPPET,
  UPDATE_SNIPPET,
} from "../utils/queries";
import { Alert, Button } from "react-bootstrap";
import "../styles.css";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs"; // Choose the style you prefer
import { commonLanguages } from "../utils/languages";

const SnippetList = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data ? data.me : {};
  const user = userData;
  const snippets = user ? user.snippets || [] : [];

  // Function to split the tags string into an array of tags
  const splitTags = (tags) => {
    return tags.split(",").map((tag) => tag.trim());
  };

  const [currentAction, setCurrentAction] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    code: "",
    tags: "",
    private: false,
  });

  const [addSnippet] = useMutation(ADD_SNIPPET, {
    update(cache, { data: { addSnippet } }) {
      cache.modify({
        fields: {
          me(existingRef = []) {
            if (!Array.isArray(existingRef)) {
              existingRef = [];
            }
            return [...existingRef, addSnippet];
          },
        },
      });
    },
    refetchQueries: [{ query: QUERY_ME }],
  });

  const [deleteSnippet] = useMutation(DELETE_SNIPPET, {
    update(cache, { data: { deleteSnippet } }) {
      cache.modify({
        fields: {
          me(existingRef, { readField }) {
            if (!Array.isArray(existingRef)) {
              return existingRef;
            }
            return existingRef.filter(
              (ref) => readField("_id", ref) !== deleteSnippet._id
            );
          },
        },
      });
    },
    refetchQueries: [{ query: QUERY_ME }],
  });

  const [updateSnippet] = useMutation(UPDATE_SNIPPET, {
    refetchQueries: [{ query: QUERY_ME }],
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    // If the input is a checkbox, handle the 'checked' value
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue,
    }));
  };

  const handleAddSnippet = () => {
    setCurrentAction("add");
    setFormData({
      title: "",
      description: "",
      language: "",
      code: "",
      tags: "",
      private: false, // Set the initial value for the 'private' field
    });
  };

  const handleEditSnippet = (snippet) => {
    setCurrentAction("update");
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

  // State to keep track of copied snippets
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);

  const handleCopySnippet = (snippetId) => {
    const snippetToCopy = snippets.find((snippet) => snippet._id === snippetId);
    if (snippetToCopy) {
      navigator.clipboard
        .writeText(snippetToCopy.code)
        .then(() => {
          setCopiedSnippetId(snippetId); // Set the snippet ID as copied
          setTimeout(() => {
            setCopiedSnippetId(null); // Reset the copied snippet ID after 2.5 seconds
          }, 2500);
        })
        .catch((error) => {
          console.error("Failed to copy code snippet:", error);
          alert("Failed to copy code snippet. Please try again.");
        });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (currentAction === "add") {
      await addSnippet({
        variables: { ...formData },
      });
    } else if (currentAction === "update") {
      await updateSnippet({
        variables: { snippetId: snippets[0]._id, ...formData },
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
          {snippets.length === 0 ? (
            <Alert variant="info">You haven't added any snippets yet.</Alert>
          ) : (
            snippets.map((snippet) => {
              // Convert tags to an array by splitting the tags string
              const tagsArray = Array.isArray(snippet.tags)
                ? snippet.tags
                : splitTags(snippet.tags);

              return (
                <li key={snippet._id} className="snippet-item">
                  <div className="snippet-header">
                    {" "}
                    {/* Add a div to wrap the snippet header */}
                    <h4 className="snippet-title">
                      {snippet.title}{" "}
                      {snippet.private ? "(Private)" : "(Public)"}
                    </h4>
                    <p className="snippet-description">{snippet.description}</p>
                  </div>
                  <p>Language: {snippet.language}</p>
                  <p>Code:</p>
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={tomorrow}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>

                  <div className="tags-container">
                    <h5>Tags:</h5>
                    {tagsArray.length > 0 ? (
                      <ul className="tags-list">
                        {tagsArray.map((tag, index) => (
                          <li key={index} className="tag-item">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tags available.</p>
                    )}
                  </div>

                  <div className="fancyButtons">
                    {currentAction === "update" ? ( // Conditionally render the form when updating a snippet
                      <form className="form-container" onSubmit={handleSubmit}>
                        <div>
                          <label htmlFor="title">Title</label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                          />
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
                          <select
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                          >
                            <option value="">Select a language</option>
                            {commonLanguages.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="tags">Tags</label>
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="code">Code</label>
                          <textarea
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            rows={10}
                          />
                        </div>

                        <div>
                          <label htmlFor="private">Private</label>
                          <input
                            type="checkbox"
                            name="private"
                            checked={formData.private}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Button type="submit">Submit</Button>
                      </form>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          onClick={() => handleEditSnippet(snippet)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteSnippet(snippet._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="info"
                          onClick={() => handleCopySnippet(snippet._id)}
                        >
                          {copiedSnippetId === snippet._id ? "Copied" : "Copy"}
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}{" "}
      {currentAction === "add" ? ( // Conditionally render the form when adding a snippet
        <form className="form-container" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
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
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
            >
              <option value="">Select a language</option>
              {commonLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="code">Code</label>
            <textarea
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              rows={10} // You can adjust the number of rows as needed
            />
          </div>

          <div>
            <label htmlFor="private">Private</label>
            <input
              type="checkbox"
              name="private"
              checked={formData.private}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      ) : (
        // Show the "Add Snippet" button when not adding a snippet
        <Button
          className="add-snippet-button"
          variant="success"
          onClick={handleAddSnippet}
        >
          Add Snippet
        </Button>
      )}
    </div>
  );
};

export default SnippetList;
