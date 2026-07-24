import React, { useState } from 'react'
import addIcon from '../assets/plus-button.png'
import cancelIcon from '../assets/delete (1).png'
import editIcon from '../assets/edit-text.png'
import coverIcon from '../assets/folder.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import tickIcon from '../assets/check-mark (1).png'

function Folder({ folder }) {
    const navigate = useNavigate()
    const [editable, setEditable] = useState(false)
    const [note, setNote] = useState(folder.note)

    const changeFolderNote = (e) => {
        e.preventDefault()

        if (folder.note === note) {
            setEditable(false)
            return
        }

        axios.post('/api/v1/folder/changeNote',
            {
                folder_id: folder._id,
                note
            },
            {
                withCredentials: true
            }
        )
            .then((response) => {
                const data = response?.data

                if (data.statuscode > 400 || data.success === false) {
                    if (data.message === "invalid access token !!" || data.message === "unauthorised request !!" || data.message === "jwt expired") {
                        alert('session expired')
                        navigate('/')
                        return
                    }
                    alert(data.message)
                }

                setEditable(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const deleteFolder = (folder_id) => {
        axios.get(`/api/v1/folder/deleteFolder/${folder_id}`)
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
                navigate('/home')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <article
                key={folder._id}
                className="relative w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-sky-900 dark:bg-[#0a1220]"                
            >
                <button
                    type="button"
                    aria-label="Remove cover"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:scale-105 hover:bg-slate-200 dark:bg-[#0f1a30] dark:text-slate-100 dark:hover:bg-[#13213c] cursor-pointer"
                    onClick={(e) => {
                        deleteFolder(folder._id)
                    }}
                >
                    <img src={cancelIcon} alt="cancel icon" className="h-4 w-4 object-contain" />
                </button>

                <div className="mb-4 flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/home/${folder.folder_name}/${folder._id}`)}>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 dark:bg-[#102447]">
                        <img src={coverIcon} alt="folder icon" className="h-6 w-6 object-contain" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{folder.folder_name}</h3>
                </div>

                <div className="relative rounded-2xl bg-slate-50 p-3 dark:bg-[#0f1a30]">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <label htmlFor="note" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Note :
                        </label>
                        <button
                            type="button"
                            onClick={() => setEditable((val) => !val)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 transition hover:scale-105 hover:bg-violet-200 dark:bg-[#102447] dark:hover:bg-[#16305a] cursor-pointer"
                        >
                            <img src={editIcon} alt="edit note" className="h-4 w-4 object-contain" />
                        </button>
                    </div>
                    <form onSubmit={changeFolderNote} className="w-full">
                        <textarea
                            rows={2}
                            disabled={!editable}
                            id="note"
                            value={note}
                            onChange={(e) => {
                                setNote(e.target.value)
                            }}
                            className={`w-full resize-none rounded-xl bg-white px-3 py-3 pb-12 text-sm text-slate-800 outline-none transition dark:bg-[#101b31] dark:text-slate-100 ${editable
                                ? 'border border-violet-400 shadow-sm'
                                : 'border border-transparent opacity-80'}`}
                        />
                        <button
                            type="submit"
                            className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center transition hover:scale-105 ${editable ? 'visible' : 'hidden'} cursor-pointer`}
                        >
                            <img src={tickIcon} alt="save note" className="h-4 w-4 object-contain" />
                        </button>
                    </form>
                </div>
            </article>
        </>
    )
}

export default Folder