import { useState, useEffect } from "react";
import { getAllSerials } from "api";

export default function SerialsForm({ callback, serials }) {
    const [allSerials, setAllSerials] = useState({});
    const [filtredSerials, setFiltredSerials] = useState([]);
    const [showSerialsDropDown, setShowSerialsDropDown] = useState(false);    

    useEffect(() => {
        if (Object.keys(allSerials).length === 0) {
            let page_size = 10000;
            getAllSerials({ page_size }).then((result) => {
                let newSerials = {};
                result.results.forEach((serial) => 
                    newSerials[serial.serial] = serial
                )
                setAllSerials(newSerials);
                setFiltredSerials(Object.values(newSerials));
            }).catch((error) => {
                console.log(error);
            })
        }
    },[])

    function getSerialFilter(event) {
        event.preventDefault();
        let filter = event.target.value;
        let newValues = []
        Object.keys(allSerials).forEach((serial) => {
            if (serial.includes(filter.toLowerCase())) {
                newValues.push(allSerials[serial]);
            }
        })
        if (newValues.length === 0) {
            let empty = {
                serial: "Нет результатов",
            }
            newValues.push(empty);
        }
        setFiltredSerials(newValues);
        setShowSerialsDropDown(true);
    }

    function SerialInSearch({ value }) {
        let checked = false;
        let showCheckBox = false;
        if (Object.keys(serials).includes(value.toString())){
            checked = true;
        }
        if (Object.keys(allSerials).includes(value.toString())) {
            showCheckBox = true;
        }
        const [showCheckbox, setShowCheckbox] = useState(showCheckBox);
        const [check, setCheck] = useState(checked);

        function setSerial(event) {
            let result = false;
            let serial = allSerials[value];
            let serialId = value;
            if (event.target.checked) {
                setCheck(true);
                result = true;
            } else {
                setCheck(false);
                result = false;
            }
            setShowSerialsDropDown(true);
            callback(serial, serialId, result)
        }
        return (
            <li>
                <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    { showCheckbox && 
                        <input id="checkbox-item-11" 
                            type="checkbox" 
                            onChange={setSerial} 
                            className="shop-list-checkbox" 
                            defaultChecked={check}
                        />
                    }
                    <label className="shop-list-label">{value}</label>
                </div>
            </li>
        )
    }

    return (
        <div> 
            <label className="common-label">
                 Добавить серийные номера
            </label> 
            <label className="sr-only">Серийники</label>
            <div className="flex">
                <button id="dropdown-button" 
                    className="arrow-serial-choice" 
                    type="button"
                    onClick={() => setShowSerialsDropDown(!showSerialsDropDown)}
                    >
                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                </svg></button>
                <div className="relative w-full">
                    <input 
                        type="search" 
                        id="search-dropdown" 
                        className="h-12 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                        placeholder="Выбрать отдельные серийные номера" 
                        onClick={() => setShowSerialsDropDown(true)}
                        onChange={getSerialFilter}
                    />
                </div>
            </div>
                {showSerialsDropDown && 
                    <ul className="absolute w-full z-10 h-48 px-3 pb-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                        {filtredSerials.map((serial) => { 
                            return <SerialInSearch key={`serial_${serial.serial}`} value={serial.serial} />}
                        )}
                    </ul>
                }
        </div>

    )
}