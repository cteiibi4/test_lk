import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllSerials } from "../api";


export default function Serials() {
    const navigate = useNavigate();
    const [serials, setSerials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sort, setSort] = useState('serial');
    const [sortDirection, setSortDirection] = useState(true);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [filter, setFilter] = useState(null);
    const [filterField, setFilterField] = useState(null)
    const [showFilters, setShowFilters] = useState(false);
    const [filterFields, setFilterFields] = useState([])
    useEffect(() => {if (isLoading) {
        setIsLoading(false);
        getAllSerials({ sort, page, sortDirection, filter, filterField})
            .then((result) => {
                setSerials(result.results);
                setPages(result.showing_pages);
                setFilterFields(result.filter_fields);
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 401) {
                    return navigate('/login')
                }
            })
    }})

    const dataName = {
        serial: { name: 'Серийный номер', sort: true },
        client: { name: 'Клиент', sort: false },
        shop_code: { name: 'Номер магазина', sort: true },
        address: { name: 'Адресс магазина', sort: false },
        // mac: { name: 'MAC адрес', sort: false },
        cpu_name: { name: 'Имя процессора', sort: false },
        os: { name: 'Операционная система', sort: false },
        screen_resolution: { name: 'Разрешение экрана', sort: false },
        ip: { name: 'ip адрес', sort: false },
        hostname: { name: 'Имя хоста', sort: false },
        active: { name: 'Онлайн', sort: true },
    };

    function addFilter(event) {
        event.preventDefault();
        let data = new FormData(event.target);
        setFilter(data.get("search"))
        setIsLoading(true);
    }

    function choiceFilter(field) {
        setFilterField(field);
        setShowFilters(false);
    }

    function clearFilters(event) {
        event.preventDefault();
        setFilter(null);
        setFilterField(null);
        setIsLoading(true);
    }

    function Sort({ fieldName }) {
        console.log(fieldName)
        if (fieldName === sort) {
            setSortDirection(!sortDirection);
        } else {
            setSort(fieldName);
            setSortDirection(true);
        }
        setIsLoading(true)
    }

    function NotActiveSortElement({ fieldName }) {
        return (
            <a href="#" onClick={() => Sort({ fieldName })}>
                <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                </svg>
            </a>
        )
    }

    function ActiveSortElementFalse({ fieldName }) {
        return (
            <a href="#" onClick={() => Sort({ fieldName })}>
                <svg className="w-3 h-3 ms-1.5" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="3,0 0,6 6,6" fill="currentColor" viewBox="0 0 24 24" />
                </svg>
            </a>
        )
    }

    function ActiveSortElementTrue({ fieldName }) {
        return (
            <a href="#" onClick={() => Sort({ fieldName })}>
                <svg className="w-3 h-3 ms-1.5" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="3,12 0,6 6,6" fill="currentColor" viewBox="0 0 24 24" />
                </svg>
            </a>
        )
    }

    function Header({ data, fieldName }) {
        const headerKey = "header_" + fieldName;
        return (
            <th key={headerKey} scope="col" className="px-6 py-3">
                <div className="flex items-center">
                    {data.name}
                    {data.sort && sort === fieldName && sortDirection === true ?
                        <ActiveSortElementTrue fieldName={fieldName} /> : data.sort && sort === fieldName ?
                            <ActiveSortElementFalse fieldName={fieldName} /> : data.sort ?
                                <NotActiveSortElement fieldName={fieldName} /> :
                                null}

                </div>
            </th>
        )
    }

    function HeaderRow() {
        return (
            <thead id="header_row" key="header_row" className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    {Object.keys(dataName).map(data =>
                        <Header data={dataName[data]} fieldName={data} key={data}/>
                    )}
                </tr>
            </thead>
        )
    }

    function Circle({ color }) {
        return (
            <svg viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="5" fill={color} />
            </svg>
        )
    }

    function Cell({ text, link, dataName }) {
        var element = null;
        if (dataName === 'active') {
            let color = "red";
            if (text === true) {
                color = 'green';
            }
            element = <td className="px-14 py-4"><Circle color={color} /></td>;
        } else if (link != null) {
            const url = link + "/";
            element = <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"><Link to={url} > {text}</Link></th>;
        } else {
            element = <td className="px-6 py-4">{text ? text : "--"}</td>;
        }
        return (element)
    }

    function Row({ data }) {
        const shop_data = data.shop;
        const data_row = Object.assign(data, shop_data);
        return (
            <tr key={data_row.serial} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                {Object.keys(dataName).map(key =>
                    <Cell text={data_row[key]} link={key === "serial" ? data_row['serial'] : null} dataName={key} key={"cell_"+data_row.serial+key} />
                )}
            </tr>
        )

    }

    function Rows() {
        return (
            <tbody id="serials_rows">
                {serials.map(serial =>
                    <Row data={serial} key={serial.id} />
                )}
            </tbody>
        )
    }

    function setPageNum({ pageNum }) {
        setPage(pageNum);
        setIsLoading(true);
    }

    function pageMove({ direction }) {
        let pageNum = page + direction;
        setPageNum({ pageNum });
    }

    function PaginationPage({ pageNumber }) {
        const pageKey = "page-" + pageNumber
        let paginationPage = null;
        if (page === pageNumber) {
            paginationPage =
                <li key={pageKey}>
                    <a onClick={() => setPageNum({ pageNum: pageNumber })} aria-current="page" className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{pageNumber}</a>
                </li>
        } else {
            paginationPage =
                <li key={pageKey}>
                    <a onClick={() => setPageNum({ pageNum: pageNumber })} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{pageNumber}</a>
                </li>
        }
        return paginationPage

    }

    function Pagination() {
        let paginationPages = pages;
        let pagination =
            <div key="pagination" className="flex justify-center mt-1">
                <nav aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-10 text-base">
                        <li key="go_left">
                            <a href="#" onClick={() => pageMove({ direction: -1 })} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Previous</span>
                                <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                                </svg>
                            </a>
                        </li>
                        {paginationPages.map(p =>
                            <PaginationPage pageNumber={p} />
                        )}
                        <li key="go_right">
                            <a href="#" onClick={() => pageMove({ direction: 1 })} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Next</span>
                                <svg className="w-3 h-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>

            </div>
        if (pages.length > 1) {
            return pagination
        }
    }

    function SearchForm() {
        return (
            <form onSubmit={addFilter} className="mt-1 mb-2">
                <div className="flex">
                    <button 
                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-e-0 border-gray-300 dark:border-gray-700 dark:text-white rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" 
                    type="button"
                    onClick = {() => setShowFilters(!showFilters)}
                    >
                        {filterField ? filterFields[filterField] :"Фильтр"}
                        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    { showFilters ? 
                    <div id="dropdown" className="absolute top-10 -15 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700" aria-hidden="true">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button" aria-hidden="true">
                            {Object.keys(filterFields).map( filter_field => <li>
                                <a onClick={() => choiceFilter(filter_field)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{filterFields[filter_field]}</a>
                            </li>)}
                        </ul>
                    </div> : null}
                    <div className="relative w-full">
                        <input type="search" id="search" name="search" defaultValue={filter? filter:null} className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search" required />
                        <button onClick={clearFilters} type="reset" className="absolute top-0 end-7 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:border-gray-700 dark:focus:ring-gray-700">Сбросить фильтры</button>
                        <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg></button>
                    </div>
                </div>
            </form >
        )
    }

    return (
        <div className="relative overflow-x-auto shadow-md">
            <SearchForm />
            <table className=" text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-s-lg">
                <HeaderRow />
                <Rows />
            </table>
            { pages.length > 1 ? <Pagination /> : null}
        </div>
    )
}

