import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext)

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">Home</Link>
        {/* Toggler button */}
        <button 
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ">

            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>

                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light ms-2"
                    onClick={logoutUser}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

      </div>
    </nav>
  );
}
