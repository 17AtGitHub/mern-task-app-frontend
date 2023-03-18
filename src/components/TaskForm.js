import React from 'react'

//destrcture the props coming from the tasklist into the task form
const TaskForm = ({createTask, name, handleInputChange, isEditing, updateTask}) => {
  return (
    <form className='task-form' onSubmit={isEditing ? updateTask : createTask}>
        <input type="text" placeholder='Add a task' name='name' 
        value={name} onChange={handleInputChange} />
        <button type="submit"> {isEditing ? "Edit" : "Add"}</button>
    </form>
  )
}

export default TaskForm
