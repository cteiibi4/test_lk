import { useState, useEffect } from "react";
import { getSerialsFromShop } from "api";
import GoBack from "./elements/goBack"
import ShopForm from "./elements/shopForm"
import SerialsForm from "./elements/serialsForm";

export default function Multitask() {
    const [shopId, setShopId] = useState(0);
    const [serials, setSerials] = useState({});


    function setShopNo(id) {
        let shop_id = id;
        getSerialsFromShop(shop_id).then((result) => {
            let newSerials = serials;
            result.forEach((serial) => 
                newSerials[serial.serial] = serial
            );
            setSerials(newSerials);
        })
    }

    function setSerial(serial, serialId, result) {
        let s = serials;
        if (result) {
            s[serialId] = serial;
        } else {
            delete s[serialId];
        }
        setSerials(s);
    }

    function ChoicedSerials() {

        function SerialButton({serial}) {

            function onClick(serial){
                console.log(serial)
                let s = serial.serial;
                delete serials[s];
                // setSerials(ser);
                // setShowingSerials(ser);
                console.log(serial)
                // console.log(ser);
            }

            return (
                <button 
                    onClick={() => onClick(serial)}
                    className="serial-choiced"
                >
                    {serial.serial} x
                </button>
            )
        }

        return(
            <div>
                <label className="common-label">
                    Выбранные серийные номера
                </label> 
                <div className="h-12 common-input grid grid-cols-8 gap-2 p-1">
                {
                    Object.keys(serials).map((serial) => 
                        {
                            return <SerialButton serial={serials[serial]} key={`choised_${serial}`}/>
                        }
                    )
                }
                </div>
            </div>
        )
    }

    return (
        <div className="relative overflow-x-auto shadow-md">
            <GoBack text="Задачи" />
            <form className="mb-4 border border-gray-200 bg-gray-100 dark:bg-gray-500 dark:border-gray-700 rounded-lg p-2">
                <ShopForm callback={setShopNo}/>
                <SerialsForm callback={setSerial} serials={serials}/>
                <ChoicedSerials />
            </form>
        </div>
    )
}