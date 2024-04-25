import { useState } from 'react';
import { Outlet, Link } from "react-router-dom";


export default function MainRoute () {
  const [currentRoute, setCurrentRoute] = useState("");
  function onClick ({name}) {
    setCurrentRoute(name)
  }

  function RouteString({linkTo, name, text}) {
    return (
      <li>
        <Link to={ linkTo } 
          onClick={() => onClick({ name }) } 
          className={ currentRoute === name ? 
            "flex items-center p-2 text-gray-900 dark:bg-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 group" : 
            "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 group"} 
        >
          <span className="ms-3">{ text }</span>
        </Link>
      </li>
    )
  }

  return (
    <>
    <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-all duration-500 transform -translate-x-60 bg-white shadow-lg hover:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-200 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <RouteString
            linkTo="serials/"
            name="serials"
            text="Серийные номера"
            />
          <RouteString
            linkTo="multitask/"
            name="multitask"
            text="Мультитаск"
            />

       </ul>
    </div>
 </aside>
 <div className="overflow-clip flex-nowrap bg-grey-500 pt-2 pl-6 pr-2">
    <Outlet />
 </div>
 </>
)
}