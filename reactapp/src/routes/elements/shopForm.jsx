import { useState, useEffect } from "react";
import { getShops } from "api";


export default function ShopForm( {callback} ) {
    const [shopList, setShopList] = useState([]);
    const [allShops, setAllShops] = useState([]);
    const [shopInput, setShopInput] = useState("");
    const [shopsDropdown, setShopsDropdown] = useState(false);

    useEffect(() => {
        if (shopList.length === 0) {
            getShops().then((result) => {
                let shop_list = []
                result.results.forEach((shop) => {
                    let s = {
                        label: `${shop.shop_code} ${shop.address}`,
                        value: shop.id,
                    }
                    shop_list.push(s)}
                )
                setAllShops(shop_list);
                setShopList(shop_list);
            })
        }
    }, [])

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
                setShopsDropdown(false);
            }
        })
        callback(id);
    }

    function ShopListElement({ label, value }) {
        return (
            <li key={value} onMouseDown={() => setShopNo(value)} >
                <p className="shop-list-element">{label}</p>
            </li>
        )
    }
    return (

        <div>
            <label className="common-label"
            >Магазин</label>
            <input autoFocus
                onBlur={() => setShopsDropdown(false)}
                type="text"
                onClick={() => setShopsDropdown(true)}
                onChange={ getShopsFilter }
                id="shop-input"
                className="common-input"
                placeholder="Добавить серийники выбранного магазина в список"
                value={ shopInput }
            />
            {shopsDropdown ?
                <div id="dropdown" className="absolute z-20 block w-full bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {shopList.map(shop =>
                            <ShopListElement label={shop.label} value={shop.value} key={shop.value} />)
                        }

                    </ul>
                </div> : null
            }
        </div>
    )
}