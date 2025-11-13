import { Link } from 'react-router-dom'
import './nav.css'
export default function Nav() {
  return (
    <>
      <ul className="inline">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profiles/gallery/">Gallery</Link>
        </li>
        <li>
          <Link to="/profiles/add/">Add new profile</Link>
        </li>
      </ul>
      <hr />
    </>
  )
}
