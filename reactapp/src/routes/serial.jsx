import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSerial, getShops, setSerialShopNo, changeSerialNo, acceptFeatures, changeAcceptSerial } from "../api";
import GoBack from "./elements/goBack"


export default function Serial() {
    const params = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [features, setFeatures] = useState({});
    const [serial, setSerial] = useState({ serial: 0, });
    const [shopInput, setShopInput] = useState("");
    const [shopsDropdown, setShopsDropdown] = useState(false);
    const [shopList, setShopList] = useState([]);
    const [shopAccept, setShopAccept] = useState(false);
    const [shopError, setShopError] = useState(false);
    const serial_no = params.serial;
    const [shopId, setShopId] = useState(0);
    const [allShops, setAllShops] = useState([]);
    var text = `Серийный номер: ${serial_no}`

    useEffect(() => {
        if (isLoading) {
            setIsLoading(false);
            getSerial({ serial_no })
                .then((result) => {
                    result.features.map((feature) => {
                        features[feature.feature_id] = feature
                    });
                    Object.keys(result).map((key) => {
                        serial[key] = result[key]
                    });
                    let shop = result.shop;
                    let shop_input = `${shop.shop_code} ${shop.address}`;
                    setShopId(shop.id)
                    setShopInput(shop_input);
                })
                .catch((error) => {
                    console.log(error);
                    navigate('/serials');
                })
        }
        if (shopList.length === 0) {
            getShops().then((result) => {
                let shop_list = []
                result.results.map((shop) => {
                    let s = {
                        label: `${shop.shop_code} ${shop.address}`,
                        value: shop.id,
                    }
                    shop_list.push(s)
                })
                setAllShops(shop_list)
                setShopList(allShops);
            })
        }
    })

    function NumberForm() {
        const [changeNumberlError, setChangeNumberError] = useState(false);
        const [changeNumberExist, setChangeNumberExist] = useState(false);
        const [changeNumberSuccess, setChangeNumberSuccess] = useState(false);
        const [acceptSerial, setAcceptSerial] = useState(serial.accept_serial);

        function submitChangeNumber(event) {
            event.preventDefault();
            let data = new FormData(event.target)
            let new_number = data.get("new_number");
            console.log(new_number);
            let serial_id = serial.id;
            let shop_id = serial.shop.id;
            changeSerialNo({ serial_id, shop_id, new_number }).then(
                (result) => {
                    setChangeNumberExist(false);
                    setChangeNumberError(false);
                    Object.keys(result).map((key) => {
                        serial[key] = result[key]
                    });
                    setChangeNumberSuccess(true);
                }
            ).catch(
                (error) => {
                    if (error.response.status === 400) {
                        setChangeNumberExist(true);
                        setChangeNumberError(false);
                        setChangeNumberSuccess(false);
                    } else {
                        setChangeNumberExist(false);
                        setChangeNumberError(true);
                        setChangeNumberSuccess(false);
                    }
                }
            )
        }

        function sendAcceptSerial(event){
            let serial_id = serial.id;
            changeAcceptSerial({serial_id, acceptSerial}).then((result) => {
                serial.accept_serial = !acceptSerial;
                setAcceptSerial(!acceptSerial);
            }).catch((error)=>{
                console.log(error);
            })

        }
        return (<form onSubmit={submitChangeNumber} className="mb-4 border border-gray-200 bg-gray-100 dark:bg-gray-500 dark:border-gray-700 rounded-lg p-2">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Номер КСО</label>
                <input type="number"
                    id="new_number"
                    name="new_number"
                    placeholder={serial.cashier_number}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required />
                {changeNumberSuccess ? <label className="text-red-600 dark:text-green-500">Номер успешно изменен</label> : null}
                {changeNumberlError ? <label className="text-red-600 dark:text-red-500">Что-то пошло не так</label> : null}
                {changeNumberExist ? <label className="text-red-600 dark:text-red-500">Такой номер занят</label> : null}
                <div className="flex justify-between mt-2 mb-0">
                    <div>
                        <input type="checkbox" onChange={sendAcceptSerial} checked={acceptSerial} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Принять серийник</label>
                    </div>
                    <button
                        type="submit"
                        className="justify-self-end text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-400">Сменить номер</button>
                </div>
            </div>
        </form>)
    }

    function ShopForm({ list, labelName }) {
        function getShopsFilter(event) {
            let filter = event.target.value;
            let newValues = []
            allShops.forEach((shop) => {
                if (shop.label.includes(filter.toLowerCase())) {
                    newValues.push(shop);
                }
            })
            if (newValues.length === 0) {
                let empty = {
                    label: `Нет результатов`,
                    value: null,
                }
                newValues.push(empty)
            }
            setShopList(newValues);
            setShopsDropdown(true);
            setShopInput(filter);
            event.target.focus()
        }
        
        function setShopNo(id) {
            shopList.map((shop) => {
                if (shop.value == id) {
                    let value = shop.label;
                    setShopInput(value);
                    setShopId(id);
                    setShopsDropdown(false);
                }
            })
        }
    
        function submitShopNo(event) {
            event.preventDefault();
            let serial_id = serial.id;
            setSerialShopNo({ serial_id, shopId })
                .then((result => {
                    Object.keys(result).map((key) => {
                        serial[key] = result[key]
                    });
                    setShopAccept(true);
                    setShopError(false);
                })).catch((error) => {
                    console.log(error);
                    setShopAccept(false);
                    setShopError(true);
                })
    
        }
    
        function ShopListElement({ label, value }) {
            return (
                <li key={value} onMouseDown={() => setShopNo(value)} >
                    <p className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{label}</p>
                </li>
            )
        }
        return (
            <form onSubmit={submitShopNo} className="mb-4 border border-gray-200 bg-gray-100 dark:bg-gray-500 dark:border-gray-700 rounded-lg p-2">
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{labelName}</label>
                    <input autoFocus onBlur={() => setShopsDropdown(false)} type="text" onClick={() => setShopsDropdown(true)} onChange={getShopsFilter} id="shop-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={shopInput}
                    />
                    {shopsDropdown ?
                        <div id="dropdown" className="absolute z-10 block w-full bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                {list.map(shop =>
                                    <ShopListElement label={shop.label} value={shop.value} key={shop.value} />)
                                }

                            </ul>
                        </div> : null
                    }
                </div>
                {shopAccept ? <label className="font-medium text-purple-800">Магазин сохранен</label> : null}
                {shopError ? <label className="font-medium text-red-600">Не удалось сохранить магазин</label> : null}
                <div className="flex justify-end mt-2">
                    <button
                        type="submit"
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-400">Сохранить</button>
                    {/* <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Сбросить</button> */}
                </div>
            </form>
        )
    }

    function FeatureForm() {
        const [featureError, setFeatureError] = useState(false);
        const [featureAccept, setFeatureAccept] = useState(false);
        const [showFeatures, setShowFeatures] = useState(true);
        function submitFeatures(event) {
            setFeatureAccept(false);
            setFeatureError(false);
            event.preventDefault();
            let serial_id = serial.id;
            acceptFeatures({ features, serial_id }).then((result) => {
                result.features.map((feature) => {
                    features[feature.feature_id] = feature
                });
                Object.keys(result).map((key) => {
                    serial[key] = result[key]
                });
                setFeatureAccept(true);
            }).catch((error) => {
                setFeatureError(true);
                console.log(error);
            })
        }

        function ShowHideFeatureButton() {
            var class_name = "arrow-top-2 w-5 h-5 mr-2 fill-grey-700 dark:fill-white"
            if (showFeatures){
                class_name = class_name + " rotate-270"
            } else {
                class_name = class_name + " rotate-90"
            }
            return (
                <a onClick={()=>{setShowFeatures(!showFeatures)}}>
                    <svg className={class_name} viewBox="0 0 9 14" >
                        <path className="svg-arrow" d="M6.660,8.922 L6.660,8.922 L2.350,13.408 L0.503,11.486 L4.813,7.000 L0.503,2.515 L2.350,0.592 L8.507,7.000 L6.660,8.922 Z" />
                    </svg>
                </a>
            )
        }

        function Feature({ feature }) {
            const [value, setValue] = useState(feature.value);

            function changeBoolValue(event) {
                event.preventDefault();
                if (feature.value === "true") {
                    feature.value = "false";
                } else if (feature.value === "false") {
                    feature.value = "true";
                } else {
                    let val = event.target.value;
                    feature.value = val
                }
                setValue(feature.value);
            }

            if (feature.type === "BOOL") {
                let true_class = "border-2 block max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                let false_class = "border-2 block max-w-full p-4 bg-gray-200 border border-gray-300 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-600 dark:border-gray-900 dark:hover:bg-gray-700"
                return (
                    <div onClick={changeBoolValue} className={value === "true" ? true_class : false_class}>
                        <p className="font-normal text-gray-700 dark:text-gray-300" >
                            {feature.description}
                        </p>
                        <p className=" text-sm font-normal text-gray-700 dark:text-gray-400" >
                            {feature.name}
                        </p>
                        {value === "true" ? <p className="flex justify-end text-green-600 ">Активно</p> : <p className=" flex justify-end text-red-600 dark:text-red-500">Неактивно</p>}
                    </div>
                )
            } else {
                return (
                    <div className="block content-between max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <p className=" font-normal text-gray-700 dark:text-gray-300" >
                            {feature.description}
                        </p>
                        <p className=" text-sm font-normal text-gray-700 dark:text-gray-400" >
                            {feature.name}
                        </p>
                        <input className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={feature.value}
                            onChange={changeBoolValue}
                            value={value} />
                    </div>
                )
            }
        }

        return (
            <form onSubmit={submitFeatures} className="mb-6 border border-gray-200 bg-gray-100 dark:bg-gray-500 dark:border-gray-700 rounded-lg p-2">
                <div className="flex justify-between">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Фичи</label>
                    <ShowHideFeatureButton />
                </div>
                { showFeatures ? 
                <div>
                    <div className="grid gap-4 grid-cols-2">
                        {Object.keys(features).map(f_key => <Feature feature={features[f_key]} key={`feature_${f_key}`} />)}
                    </div>
                    {featureError ? <p className="text-red-600 dark:text-red-500">Не удалось применить изменения</p> : null}
                    {featureAccept ? <p className="text-green-600 dark:text-green-500">Фичи успешно изменены</p> : null}
                    <div className="flex justify-end mt-2 mb-0">
                        <button
                            type="submit"
                            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-400">Применить</button>
                    </div>
                </div>
                : null }
            </form>
        )
    }

    return (
        <div className="relative overflow-x-auto shadow-md ">
            <GoBack text = {text} />
            <div className="mt-3 bg-grey-100 dark:bg-grey-200">
                <NumberForm />
                <ShopForm labelName={"Магазин"} list={shopList} />
                <FeatureForm />
            </div>
        </div>
    )
}