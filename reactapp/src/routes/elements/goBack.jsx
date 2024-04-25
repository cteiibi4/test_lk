import { useNavigate } from "react-router-dom";

export default function GoBack({text}) {
    const navigate = useNavigate();

    function goBack(event) {
        event.preventDefault();
        return navigate('/serials')
    }
    return (
        <div className="flex flex-row items-center align-middle">
            <button onClick={goBack} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                Назад
            </button>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{text}</label>
        </div>)
}