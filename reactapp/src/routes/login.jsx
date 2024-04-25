import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import settings from '../settings'

export default function Login() {
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const url = settings.base_url + "/api/users/login/";

  const Error = () => {
    return(
      <div className="mt-2">
        <p className="flex justify-center text-red-600 text-sm font-medium animate-shake">Неверный логин или пароль</p>
      </div>
    )
  }

  function auth(e) {
    e.preventDefault();
    setShowError(false);
    let data = new FormData(e.target);
    let data_to_send = {
      username: data.get('login'),
      password: data.get('password')
    }
    const instatnce = axios.create({
      headers: {
        'Accept': 'application/json',
        }

    })
    instatnce.post(url, data_to_send)
      .then((result) => {
        localStorage.setItem('access', result.data.access);
        localStorage.setItem('refresh', result.data.refresh);
        setShowError(false);
        navigate('/serials');
      })
      .catch((error) => {
        setShowError(true);
      })
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">  
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={ auth }>
            <div>
              <div className="mt-2">
                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="login"
                  required
                  placeholder="Введите логин"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Введите пароль"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
            { showError ? <Error /> : null}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Войти
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}