import React, { useEffect, useState } from 'react'
import coverIcon from '../assets/folder.png'
import addIcon from '../assets/plus-button.png'
import cancelIcon from '../assets/cancel.png'
import editIcon from '../assets/edit-text.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Folder from './Folder'

function Folders() {
    const navigate = useNavigate()
    const [folders, setFolders] = useState([])
    const [formVisible, setFormVisible] = useState(false)

    const [folder_name, setFolder_name] = useState("")
    const [note, setNote] = useState("")

    // get user folders
    useEffect(() => {
        axios.get('/api/v1/folder/userFolders', { withCredentials: true })
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
                setFolders(data.data)
            })
            .catch((error) => {
                console.log(error)
            })

    }, [folders])

    const createCover = (e) => {
        e.preventDefault()

        axios.post('/api/v1/folder/newFolder', {
            folder_name, note
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
                setFolder_name("")
                setNote("")

                setFormVisible(false)

                navigate(`/home/${data.data.folder_name}/${data.data._id}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return (
        <section className="h-auto  border-slate-300 bg-slate-100 px-2 py-4 text-slate-900 transition-colors duration-300 dark:border-sky-800 dark:bg-[#030712] dark:text-slate-100 sm:px-3 lg:px-4">
            <div className="mx-auto w-full min-w-70 pb-2">

                {/* // heading section */}
                <div className="mb-5 flex flex-col gap-4 rounded-3xl border border-transparent p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 dark:bg-[#0f2747]">
                            <img src={coverIcon} alt="folder icon" className="h-7 w-7 object-contain" />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">Workspace</p>
                            <h1 className="text-xl font-bold sm:text-2xl">My Covers</h1>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setFormVisible(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:hover:bg-[#111b31] cursor-cell"
                    >
                        <img src={addIcon} alt="Add cover icon" className="h-4 w-4 object-contain" />
                        create cover
                    </button>
                </div>

                {/* // create cover form */}
                <div className={`${formVisible ? 'visible' : 'invisible'} absolute inset-0 z-20 flex items-center justify-center bg-[#020617]/70 px-4`}>
                    <div className="relative w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-sky-900 dark:bg-[#09111d]">
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
                                <img src={coverIcon} alt="folder icon" className="h-6 w-6 object-contain" />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">New Cover</p>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create Cover</h2>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={createCover}>
                            <div className="space-y-2">
                                <label htmlFor="folder_name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cover title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter cover title"
                                    id="folder_name"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                    value={folder_name}
                                    onChange={(e) => {
                                        setFolder_name(e.target.value)
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="note" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Note</label>
                                <textarea
                                    rows="4"
                                    placeholder="Enter note"
                                    id="note"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-sky-900 dark:bg-[#0b1220] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-950/60"
                                    value={note}
                                    onChange={(e) => {
                                        setNote(e.target.value)
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500 dark:bg-[#0f6fd8] dark:hover:bg-[#1680f0]"
                            >
                                Create cover
                            </button>
                        </form>
                    </div>
                </div>


                {/* folders */}
                {folders.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-10 text-center shadow-sm dark:border-sky-900 dark:bg-[#0a1220]/80">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 dark:bg-[#102447]">
                            <img src={coverIcon} alt="folder icon" className="h-7 w-7 object-contain" />
                        </div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">No covers yet</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Start adding covers</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                            Create your first cover to organize tasks, notes, and ideas in a clean workspace.
                        </p>
                        <button
                            type="button"
                            onClick={() => setFormVisible(true)}
                            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-[#0f6fd8] dark:hover:bg-[#1680f0]"
                        >
                            <img src={addIcon} alt="Add cover icon" className="h-4 w-4 object-contain" />
                            Create your first cover
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {folders.map((folder) => (
                            <Folder folder={folder} key={folder._id} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Folders