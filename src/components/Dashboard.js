import React from 'react'

export default function Dashboard() {
  return (
    <div className="page-wrap">
      <h4>Dashboard { localStorage.email ? `(${localStorage.email})` : null }</h4>
      <p>This is dashboard and is a protected route... </p>
    </div>
  )
}
