import React, { useEffect, useState } from 'react'
import darkModeIcon from '../assets/moon (1).png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import changePassIcon from '../assets/wrench.png'
import cancelIcon from '../assets/cancel.png'

function Nav() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({})
  const [formVisible, setFormVisible] = useState(false)

  const [old_password, setOld_password] = useState("")
  const [new_password, setNew_password] = useState("")

  const [darkMode, setdarkMode] = useState(JSON.parse(sessionStorage.getItem('darkMode')) || false)

  useEffect(() => {
      if(darkMode === true){
        document.querySelector('html').classList.add("dark")
      }
      else if(darkMode === false){
        document.querySelector('html').classList.remove("dark")
      }

      sessionStorage.setItem('darkMode',darkMode)
  },[darkMode])


  useEffect(() => {
    axios.get('/api/v1/user/getUserProfile', { withCredentials: true })
      .then((response) => {
        const data = response?.data
        if (data.statuscode > 400 || data.success === false) {
          if (data.message === "invalid access token !!" || data.message === "unauthorised request !!" || data.message === "jwt expired") {
            alert('session expired')
            navigate('')
            return
          }
          alert(data.message)
          return
        }
        setProfile(data.data)
      }, [profile])
  })

  const logoutUser = (e) => {
    e.preventDefault()

    axios.post('/api/v1/user/logout', {
      withCredentials: true
    })
      .then((response) => {
        const data = response?.data
        if (data.statuscode > 400 || data.success === false) {
          if (data.message === "invalid access token !!" || data.message === "unauthorised request !!" || data.message === "jwt expired") {
            alert(data.message)
            navigate('/')
            return
          }
          navigate('/')
          return
        }
        navigate('/')
      })
      .catch((error) => {
        console.log(`unable to logout user`, error)
      })
  }

  const changePassword = (e) => {
    e.preventDefault()

    axios.post('/api/v1/user/changePassword', {
      old_password, new_password
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
          setOld_password("")
          setNew_password("")
          return
        }

        setOld_password("")
        setNew_password("")
        setFormVisible(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <nav className="w-full border-b border-slate-200 bg-white/90 dark:border-sky-900 dark:bg-[#07101c]">

      {/* change password form*/}
      <div className={`${formVisible ? 'visible' : 'invisible'} absolute inset-0 z-20 flex items-center justify-center bg-[#020617]/70 px-4`}>
        <div className="relative w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-sky-900 dark:bg-[#09111d]">
          <button
            type="button"
            aria-label="Close form"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:scale-105 hover:bg-slate-200 dark:bg-[#0f1a30] dark:text-slate-100 dark:hover:bg-[#13213c]"
            onClick={(e) => setFormVisible(false)}
          >
            <img src={cancelIcon} alt="cancel icon" className="h-4 w-4 object-contain" />
          </button>

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 dark:bg-[#0f2747]">
              <img src={changePassIcon} alt="folder icon" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">edit profile</p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Change Password</h2>
            </div>
          </div>

          <form className="space-y-4" onSubmit={changePassword}>
            <div className="space-y-2">
              <label htmlFor="old_password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Old-password</label>
              <input
                type="password"
                required
                placeholder="enter present password"
                id="old_password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                value={old_password}
                onChange={(e) => {
                  setOld_password(e.target.value)
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="new_password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">New-password</label>
              <input
                type='password'
                placeholder="enter new password"
                id="new_password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                value={new_password}
                onChange={(e) => {
                  setNew_password(e.target.value)
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 dark:bg-[#0f6fd8] dark:hover:bg-[#1680f0]"
            >
              update password
            </button>
          </form>
        </div>
      </div>



      <div className="mx-auto flex max-w-7xl items-center justify-between gap-12 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-lg font-bold text-white shadow-md shadow-sky-500/30">
            <img
              src="https://play-lh.googleusercontent.com/UrdLGCKEow6QJ5b9Wx9qvR_WdPD6aGbLqTEvd-JFGuzD5qB9w-XvqktjfAIGgzPE4tW4"
              alt="logo"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="flex w-full max-w-md items-center rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-md dark:border-sky-900 dark:bg-[#0b1220]">
            <p className="flex-1 text-center text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{profile.folders_count}</span><br />folders
            </p>
            <p className="flex-1 text-center text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{profile.todos?.total}</span><br />total todos
            </p>
            <p className="flex-1 text-center text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{profile.todos?.pending}</span><br />pending
            </p>
          </div>
        </div>




        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-sky-900 dark:bg-[#0b1220]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white dark:bg-[#0f6fd8]">
              <span className="text-lg">👤</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{profile.username}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profile.email}</p>
            </div>
          </div>

          {/* <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg text-slate-700 transition hover:scale-105 hover:bg-slate-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-200 dark:hover:bg-[#111b31]">
            <img src={darkModeIcon} alt="dark mode icon" className="h-5 w-5 object-contain" />
          </button> */}

          <button
            type="button"
            onClick={logoutUser}
            className="rounded-full border border-red-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-red-50 dark:border-red-900/70 dark:bg-[#0b1220] dark:text-slate-100 dark:hover:bg-[#1a0f18] cursor-pointer"
          >
            Logout
          </button>
          <button
            type="button"
            onClick={() => setFormVisible(true)}
            className="rounded-full bg-slate-50 transition hover:-translate-y-0.5 hover:bg-red-50 dark:border-red-900/70 dark:bg-[#0b1220] dark:text-slate-100 dark:hover:bg-[#1a0f18] cursor-pointer"
          >
            <img src={changePassIcon} alt="" className="h-7.5 w-7.5 rounded-xl object-cover" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setdarkMode((bool) => !bool)}
          className="rounded-full bg-slate-50 transition hover:-translate-y-0.5 hover:bg-red-50 dark:border-red-900/70 dark:bg-[#fafafa] dark:text-slate-100 dark:hover:bg-[#6f64e9] cursor-pointer"
        >
          <img src={darkModeIcon} alt="" className="h-6.5 w-6.5 rounded-xl object-cover" />
        </button>
      </div>
    </nav>
  )
}

export default Nav