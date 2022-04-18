import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addCommentThunk, getCommentsThunk } from "../../store/comments";
import EditView from "./EditView";
import "./Comments.css";

function Comments({ record_id }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState("");

  const commentObj = useSelector(state => state.comments);
  const sessionUser = useSelector(state => state.session.user);
  const commentList = Object.values(commentObj).filter(
    comment => comment.record_id === record_id
  );

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors("");
    if (!comment.length || comment.length > 100) {
      setErrors(
        "Comment must be at least 1 character long and less than 100 characters long"
      );
      return;
    }

    await dispatch(
      addCommentThunk({
        content: comment,
        record_id,
        user_id: sessionUser.id,
      })
    );
    setComment("");
    await dispatch(getCommentsThunk());
  };

  // need to move this block to another component------------------------
  // pass the comment, index, functions, through prop
  // const CommentMapper = (comment, i) => {
  //   const [editMode, setEditMode] = useState(false);
  //   const editModeBtn = (comment_id, clicked_id) => {
  //     setEditMode(() => true);
  //   };

  //   const cancelEditMode = async e => {
  //     e.preventDefault();
  //     await setEditMode(() => false);
  //     console.log(editMode);
  //   };

  //   const returnEditView = comment => {
  //     return (
  //       <form>
  //         <input defaultValue={comment} />
  //         <button onClick={cancelEditMode}>cancel</button>
  //       </form>
  //     );
  //   };

  //   return (
  //     <div key={comment.content + "userId"} className="comment_container">
  //       {!editMode ? (
  //         <div className="each_comments">
  //           <NavLink
  //             to={`/users/${userObj[comment.user_id]?.id}`}
  //             className="user_profile_link"
  //           >
  //             {userObj[comment.user_id]?.username}
  //           </NavLink>
  //           <p style={{ padding: "0.5rem 1rem " }}>{comment.content}</p>
  //           {/* TODO: allow the record holder to delete the comments? */}
  //           {comment.user_id === sessionUser.id && (
  //             <div className="btn_container">
  //               <button
  //                 className="edit_btn"
  //                 value={comment.id}
  //                 onClick={e => editModeBtn(comment.id, e.target.value)}
  //               >
  //                 <FontAwesomeIcon icon={faPenToSquare} />
  //               </button>
  //               <button className="delete_btn">
  //                 <FontAwesomeIcon icon={faTrashCan} />
  //               </button>
  //             </div>
  //           )}
  //         </div>
  //       ) : (
  //         <EditView content={comment.content}/>
  //         // returnEditView(comment.content)
  //       )}
  //     </div>
  //   );
  // };
  // need to move this block to another component------------------------

  return (
    <>
      <form onSubmit={handleSubmit} className="comment_form">
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: "100%" }}
          placeholder="Write a comment & hit enter to submit"
        />
        <small className="errors">{errors.length > 0 && errors}</small>
      </form>

      {commentList.length > 0 &&
        commentList.map((comment, i) => (
          // TODO: INSERT COMPONENT
          <EditView props={{ comment, index: i, sessionUser }} />
        ))}
    </>
  );
}

export default Comments;
