import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import { changePassword, getProfiles, patchProfile } from '../services/api.js'

export default function Profile() {
  const role = localStorage.getItem('role') || 'homeowner'
  const [profile, setProfile] = useState(null)
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' })
  const [msg, setMsg] = useState('')

  function load() {
    getProfiles()
      .then(items => setProfile(items.find(item => item.id === parseInt(localStorage.getItem('profile_id') || '0')) || items.find(item => item.username === localStorage.getItem('username')) || items[0] || null))
      .catch(err => setMsg(err.message))
  }

  useEffect(load, [])

  async function saveProfile(e) {
    e.preventDefault()
    try {
      await patchProfile(profile.id, {
        phone_number: profile.phone_number,
        address: profile.address,
        plan_name: profile.plan_name,
        is_active_member: profile.is_active_member,
      })
      setMsg('Profile updated.')
      load()
    } catch (err) {
      setMsg(err.message)
    }
  }

  async function savePassword(e) {
    e.preventDefault()
    try {
      await changePassword(passwords)
      setPasswords({ current_password: '', new_password: '' })
      setMsg('Password changed.')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><span>Profile</span></h1>
            <p>Update contact details and password.</p>
          </div>
        </div>
        {msg && <div className="alert alert--success">{msg}</div>}
        {!profile ? <div className="card">Loading profile...</div> : (
          <div className="content-grid">
            <div className="card">
              <div className="card-header"><span className="card-title">Account Details</span></div>
              <form onSubmit={saveProfile}>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Username</label><input className="form-control" value={profile.username} disabled /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-control" value={profile.email || ''} disabled /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-control" value={profile.phone_number || ''} onChange={e => setProfile(p => ({ ...p, phone_number: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Address</label><input className="form-control" value={profile.address || ''} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} /></div>
                </div>
                {role === 'admin' && (
                  <div className="form-group"><label className="form-label">Plan Name</label><input className="form-control" value={profile.plan_name || ''} onChange={e => setProfile(p => ({ ...p, plan_name: e.target.value }))} /></div>
                )}
                <button className="btn btn-primary">Save Profile</button>
              </form>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Change Password</span></div>
              <form onSubmit={savePassword}>
                <div className="form-group"><label className="form-label">Current Password</label><input className="form-control" type="password" value={passwords.current_password} onChange={e => setPasswords(p => ({ ...p, current_password: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">New Password</label><input className="form-control" type="password" value={passwords.new_password} onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))} required /></div>
                <button className="btn btn-primary">Change Password</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
