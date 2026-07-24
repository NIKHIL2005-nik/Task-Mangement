import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import todoIcon from '../assets/checklist.png'
import addIcon from '../assets/plus-button.png'
import cancelIcon from '../assets/cancel.png'
import axios from 'axios'
import Todo from './Todo.jsx'

function Todos() {
    const navigate = useNavigate()
    const { folder_id, folder_name } = useParams()
    const [formVisible, setFormVisible] = useState(false)

    const [todo, setTodo] = useState("")
    const [expiry, setExpiry] = useState("")
    const [priority, setPriority] = useState("low")

    const [todos, setTodos] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)

        axios.get(`/api/v1/folder/${folder_id}/todos`, { withCredentials: true })
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

                setTodos(data.data || [])
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setTodos([])
                setIsLoading(false)
            })

    }, [folder_id, navigate])

    const addTodo = (e) => {
        e.preventDefault()

        axios.post('/api/v1/todo/addTodo', {
            folder_id, todo, expiry, priority
        }, { withCredentials: true })
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
                setFormVisible(false)
                setTodo("")
                setExpiry("")
                setExpiry("low")
                setTodos((todos) => [...todos,data.data])
            })
            .catch((errr) => {
                console.log(error)
            })
    }


    return (
        <>
            <section className="min-h-fit border-r-[1.5px] border-slate-300 bg-[#0f2a53 ]px-2 py-4 text-slate-900 transition-colors duration-300 dark:border-sky-800 dark:bg-[linear-gradient(180deg,#030712_0%,#07101f_45%,#020617_100%)] dark:text-slate-100 sm:px-3 lg:px-4">
                <div className="mx-auto w-full min-w-70 pb-2">

                    {/* // heading section */}
                    <div className="mb-5 flex flex-col gap-4 rounded-[13px] border border-slate-200 bg-white/40 p-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-sky-900 dark:bg-[#09111d]/40">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 dark:bg-[#0f2747]">
                                <img src={todoIcon} alt="folder icon" className="h-7 w-7 object-contain" />
                            </div>
                            <div>
                                <p className="mb-1 inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-sky-600 dark:bg-[#102447] dark:text-sky-400">Task Space</p>
                                <h1 className="text-base font-bold sm:text-lg">{`${folder_name} > todos`}</h1>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setFormVisible(true)
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:hover:bg-[#111b31] cursor-cell"
                        >
                            <img src={addIcon} alt="Add cover icon" className="h-4 w-4 object-contain" />
                            add todo
                        </button>
                    </div>

                    {/* // create cover form */}
                    <div className={`${formVisible ? 'visible' : 'invisible'} absolute inset-0 z-20 flex items-center justify-center bg-[#020617]/70 px-4 backdrop-blur-[2px]`}>
                        <div className="relative w-full max-w-lg rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-2xl dark:border-sky-900 dark:bg-[linear-gradient(180deg,#09111d_0%,#08101d_100%)]">
                            <button
                                type="button"
                                aria-label="Close form"
                                onClick={() => setFormVisible(false)}
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:scale-105 hover:bg-slate-200 dark:bg-[#0f1a30] dark:text-slate-100 dark:hover:bg-[#13213c]"
                            >
                                <img src={cancelIcon} alt="cancel icon" className="h-4 w-4 object-contain" />
                            </button>

                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 dark:bg-[#0f2747]">
                                    <img src={todoIcon} alt="todo icon" className="h-6 w-6 object-contain" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">New Todo</p>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Todo</h2>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={addTodo}>
                                <div className="space-y-2">
                                    <label htmlFor="todo" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Task</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter task"
                                        id="todo"
                                        value={todo}
                                        onChange={(e) => setTodo(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-linear-to-r from-white to-slate-50 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-linear-to-r dark:from-[#0b1220] dark:to-[#09111d] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="expiry" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Expiry</label>
                                    <input
                                        type="date"
                                        required
                                        id="expiry"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-linear-to-r from-white to-slate-50 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-linear-to-r dark:from-[#0b1220] dark:to-[#09111d] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="priority" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Priority</label>
                                    <select
                                        id="priority"
                                        value={priority}
                                        required
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 bg-linear-to-r from-white to-slate-50 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-linear-to-r dark:from-[#0b1220] dark:to-[#09111d] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                    >
                                        <option value="low">low</option>
                                        <option value="medium">medium</option>
                                        <option value="high">high</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-500 dark:bg-[#0f6fd8] dark:hover:bg-[#1680f0]"
                                >
                                    add todo
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* todos section */}

                    {isLoading ? (
                        <div className="flex flex-col gap-2">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="animate-pulse rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-sky-900/60 dark:bg-[#0b1220]/70">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <div className="h-3 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        </div>
                                        <div className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center text-sm text-slate-600 shadow-sm backdrop-blur-sm dark:border-sky-900 dark:bg-[#09111d]/60 dark:text-slate-300">
                            No todos yet. Add your first task to get started.
                        </div>
                    ) : (
                        <div className='flex flex-col gap-0.5'>
                            {
                                todos.map((todo, index) => (
                                    <Todo key={todo._id || todo.id || `${todo.task || 'todo'}-${index}`} todo={todo} />
                                ))
                            }
                        </div>
                    )}

                </div>
            </section>
        </>
    )
}

export default Todos