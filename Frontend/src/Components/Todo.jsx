import React from 'react'
import redDot from '../assets/dot (1).png'
import yellowDot from '../assets/dot (2).png'
import greenDot from '../assets/dot (3).png'
import taskIcon from '../assets/task.png'
import tickIcon from '../assets/done (1).png'
import deleteIcon from '../assets/delete (1).png'
import doneIcon from '../assets/done.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Todo({ todo }) {
  const navigate = useNavigate()
  const currentDate = new Date()
  const expired = new Date(todo.expiry)+1 < currentDate

  const UserReadableDate = (string) => {
    const date = new Date(string)

    return date.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const markAsCompleted = () => {
    axios.get(`/api/v1/todo/update/markAsCompleted/${todo._id}`, { withCredentials: true })
      .then((response) => {
        const data = response?.data
        if (data.statuscode > 400 || data.success === false) {
          if (data.message === "invalid access token !!" || data.message === "unauthorised request !!" || data.message === "jwt expired") {
            alert('session expired')
            navigate('/')
            return
          }
          alert(data.message)
          return
        }
        location.reload()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deleteTodo = () => {
    axios.get(`/api/v1/todo/deleteTodo/${todo._id}`, { withCredentials: true })
      .then((response) => {
        const data = response?.data

        if (data.statuscode > 400 || data.success === false) {
          if (data.message === "invalid access token !!" || data.message === "unauthorised request !!" || data.message === "jwt expired") {
            alert('session expired')
            navigate('/')
            return
          }
          alert(data.message)
          return
        }
        location.reload()
      })

  }

  const priorityIcon =
    todo.priority === 'low'
      ? greenDot
      : todo.priority === 'medium'
        ? yellowDot
        : redDot

  return (
    <article
      className={`mr-2 mb-1 rounded-[20px] border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition duration-200 dark:border-sky-900 dark:bg-[#09111d]/80 ${expired || todo.completed ? 'pointer-events-none opacity-80 grayscale-[0.15]' : 'hover:-translate-y-0.5 hover:shadow-md'
        } ${todo.completed ? 'order-5' : expired ? 'order-4' : todo.priority === "low" ? 'order-3' : todo.priority === 'medium' ? 'order-2' : 'order-1'}`}
    >
      <div className="flex min-h-12.5 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <img src={taskIcon} alt="task icon" className="h-5 w-5 flex-none object-contain" />

          <p
            className={`min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-100 ${todo.completed
                ? 'line-through decoration-2 decoration-emerald-300'
                : expired ? 'line-through decoration-2 decoration-rose-500' : ''}`}
          >
            {todo.todo}
          </p>

          {
            todo.completed ?
              <img src={doneIcon} alt="completed icon" className="h-9.5 w-9.5 flex-none object-contain" />
              :
              <button
                onClick={(e) => markAsCompleted()}
                className={`${expired ? 'invisible' : 'visible'} cursor-pointer`}>
                <img src={tickIcon} alt="completed icon" className="h-12.5 w-12.5 flex-none object-contain" />
              </button>
          }
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            type="button"
            aria-label="Task priority"
            className={`flex items-center justify-center transition hover:scale-105 ${expired || todo.completed ? 'invisible' : 'visible'}`}
          >
            <img src={priorityIcon} alt="priority icon" className="h-4.5 w-4.5 object-contain" />
          </button>

          <button
            type="button"
            aria-label="Delete task"
            onClick={(e) => { deleteTodo() }}
            className={`flex items-center justify-center transition hover:scale-105 ${expired || todo.completed ? 'invisible' : 'visible'}`}
          >
            <img src={deleteIcon} alt="delete icon" className="h-4.5 w-4.5 object-contain cursor-pointer" />
          </button>

        </div>
      </div>

      <div className="mt-1 flex justify-end">
        {todo.completed ?
          <div className="text-right text-xs text-slate-500 dark:text-slate-400">
            <p>completed on : {UserReadableDate(todo.updatedAt)}</p>
          </div> : expired ?
            <p className="text-right text-xs font-medium text-rose-600 dark:text-rose-400">
              expired on : {UserReadableDate(todo.expiry)}
            </p>
            : (
              <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                <p>created on : {UserReadableDate(todo.createdAt)}</p>
                <p>expires on : {UserReadableDate(todo.expiry)}</p>
              </div>
            )
        }
      </div>
    </article>
  )
}

export default Todo