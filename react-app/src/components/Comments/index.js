import React, { useState } from "react";

function Comments() {
  const [comment, setComment] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(comment);
    // WIP save comment
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: "100%" }}
          placeholder="Write a comment..."
        />
      </form>
      {/* WIP render comments */}
    </>
  );
}

export default Comments;
