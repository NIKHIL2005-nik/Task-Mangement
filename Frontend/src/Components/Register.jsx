import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const registerUser = (e) => {
        e.preventDefault()

        axios.post('/api/v1/user/register',
            { username, password, email },
            { withCredentials: true }
        )
            .then((response) => {
                const data = response?.data

                if (data.statuscode > 400 || data.success === false) {
                    alert(data.message)
                    setUsername("")
                    setEmail("")
                    setPassword("")
                }
                else{
                    navigate('/')
                }
            })
            .catch((error) => {
                console.log('unable to register user : ',error)
            })
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 dark:bg-[#030712] dark:text-slate-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] dark:border-sky-900 dark:bg-[#07101c] lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="flex flex-col justify-between bg-slate-900 p-8 text-white sm:p-10">
                        <div>
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700 text-sky-200">
                                <span className="text-xl font-bold">✦</span>
                            </div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-300">Create account</p>
                            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Set up your task workspace</h1>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                                <p className="text-sm font-semibold text-slate-100">Organize with clarity</p>
                                <p className="mt-1 text-sm text-slate-300">Create folders, track todos, and manage your day in one clean place.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                                <p className="text-sm font-semibold text-slate-100">Start fresh</p>
                                <p className="mt-1 text-sm text-slate-300">Sign up to build your own streamlined task flow and stay on top of every update.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
                        <form onSubmit={registerUser} className="w-full max-w-md space-y-5">
                            <div className="space-y-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Register</p>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Fill in your details to get started.</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Username</label>
                                <input
                                    type="text"
                                    id='username'
                                    required
                                    placeholder='Enter your username'
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                    }}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">E-mail</label>
                                <input
                                    type="email"
                                    id='email'
                                    required
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
                                <input
                                    type="password"
                                    id='password'
                                    required
                                    placeholder='Set password'
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                    }}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <button
                                    type='submit'
                                    className="w-full rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                                >
                                    Register
                                </button>

                                <button
                                    type='button'
                                    onClick={() => navigate('/login')}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:hover:bg-[#111b31]"
                                >
                                    <span>Already have an account?</span>
                                    <span className="text-sky-600 dark:text-sky-400">Login</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register