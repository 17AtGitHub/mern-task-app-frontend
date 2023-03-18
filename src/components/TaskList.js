import React from 'react'
import {useState, useEffect} from 'react'
import TaskForm from './TaskForm'
import Task from './Task'
import { toast } from 'react-toastify'
import axios from 'axios'
import { URL } from '../App'
// import { updateTask } from '../../../backend/controllers/taskController'
// import loadingGIF from '../assets/loader.gif'

const TaskList = () => {
  console.log(URL);
  const [tasks, settasks] = useState([]);
  const [isComplete, setisComplete] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    complete: false
  });
  //to pass the name entered, we destructure the name from the formData
  const {name} = formData;//yes so always the formData will be only the name entered in the form, complete or not will be decided by the user later

  const getTasks = async () => {
    setisLoading(true);
    try {
      const {data} = await axios.get(`${URL}/api/tasks`);
      // console.log(res);
      settasks(data);
      setisLoading(false)
    } catch (error) {
      toast.error(error.message);
      console.log("error in get tasks");
      setisLoading(false)
    }
  }

  useEffect(() => {
    getTasks()
  }, []);

  const handleInputChange = (e) => {
    //destructure the name and complete fields from e
    const {name, value} = e.target;
    //spread operator, destructures all the existing input properties from the formdata
    setFormData({...formData, [name]: value});

  }

  const createTask = async (e) => {
    e.preventDefault()
    // console.log(formData);

    //validation that the input isnot empty string
    if(name === ""){
      return toast.error("Input field cannot be empty");
    }
    try {
      //doesnt get posted like this, throws CORS error
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success('Task saved successfully')
      //after posting the formData, clear the form
      setFormData({...formData, name: ""})
      getTasks()
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  const getSingleTask = async(task) => {
    try {
      setFormData({name: task.name, complete: false});
      setTaskID(task._id)
      setisEditing(true);
    } catch (error) {
      toast.error(error.message)
    }
  }
  const updateTask = async (e) => {
    //setformdata with the name value of this task
    //then, just this
    //upon click of edit, that i push it back
    // setisEditing(false);
    e.preventDefault();
    if(name === ""){
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      setFormData({...formData, name:""})
      setisEditing(false)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const setToComplete = async (task) => {
    const completedTask = {
      name: task.name,
      complete: true
    }
    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, completedTask)
      getTasks()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const [completedTasks, setcompletedTasks] = useState([]);
  useEffect(() => {
    const cTasks = tasks.filter(task => {
      return task.complete == true
    })
    setcompletedTasks(cTasks)
  }, [tasks]);
  // const completedTasks = tasks.filter((task) => task.complete == true)

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm 
        createTask={createTask} 
        handleInputChange={handleInputChange} 
        name={name} 
        isEditing={isEditing}
        updateTask={updateTask}
      />
      {
        (tasks.length!==0) && (
          <div className='--flex-between --pb'>
          <p>
              <b>Total Tasks: </b>{tasks.length}
          </p>
          <p>
              <b>Completed Tasks: </b>{completedTasks.length}
          </p>
          </div>
        )
      }
      
      <hr />
      {
        isLoading && (
          <div className='--flex-center'>
            <img style={{width: 100, height: 100}} src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif' alt="loaderGIF" />
          </div>
        )
      }
      {
        (!isLoading && tasks.length === 0) ? 
        (
          <p className='--py'> No task added. Please add a task</p>
        ) : 
        (
          <>
            {tasks.map((task, index) => {
              return <Task 
                key={task._id}
                task={task}
                index={index}
                deleteTask={deleteTask}
                getSingleTask={getSingleTask}
                setToComplete={setToComplete}
              />
            })}
          </>
        )
      }
    </div>
  )
}

export default TaskList
