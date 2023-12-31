import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import TableComponent from "../../components/table";
import {TableColumn} from "react-data-table-component";
import {ClientDataProps} from "../../interface/redux/variable.interface.ts";
import {BiPencil} from "react-icons/bi";
import {Card, CardBody} from "@material-tailwind/react";
// import {DebtorSidebar} from "../basket/debtor-sidebar.tsx";
import React from "react";
import {BreadCumbsDataProps} from "../../interface/modal/modal.interface.ts";
import {getMgId} from "../../config/servise.ts";
import BreadcumbsComponent from "../../components/page-title/breadcumbs.tsx";
import {getClientsByStoreId, getStores} from "../../redux/reducers/variable.ts";
import DateFormatComponent from "../../components/date-format";
import {FaEye, FaFilter} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";
import {DebtorSidebar} from "../basket/debtor-sidebar.tsx";
import qs from "qs";
import FilterDebts from "./filter.tsx";
import ButtonComponent from "../../components/button";

export default function Debtors() {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const location = useLocation()

    const {
        clients,
        stores,
        currentPage,
        pageCount,
        limit,
        totalCount,
        loading
    } = useAppSelector(state => state.variables)

    const query = qs.parse(location.search, {ignoreQueryPrefix: true})

    const [client, setClient] = React.useState<ClientDataProps | null>(null)
    const [isDebt, setDebt] = React.useState<boolean>(false)
    const toggleDebt = () => setDebt(!isDebt)
    const [filter, setFilter] = React.useState<boolean>(false)

    const handleFilter = () => setFilter(!filter)

    const breadCumbc: BreadCumbsDataProps[] = [
        {
            name: "Do'kon",
            link: "/seller/magazines"
        },
        {
            name: stores.find(item => item.id === Number(getMgId()))?.storeName || "",
            link: `/seller/products/${getMgId()}`
        },
        {
            name: "Qarzdorlar ro'yhati",
            link: ``
        }
    ]

    React.useEffect(() => {
        if (location.search) {
            dispatch(getClientsByStoreId({storeId: getMgId(), param: {...query, limit: 10}}))
        } else {
            dispatch(getClientsByStoreId({storeId: getMgId(), param: {limit: 10}}))
        }
    }, [location])

    React.useEffect(() => {
        dispatch(getStores())
    }, [])

    const basicColumns: TableColumn<any>[] = [
        {
            width: '50px',
            wrap: true,
            cell: (row: ClientDataProps) => (
                <><FaEye className={"text-lg text-green-500 cursor-pointer"}
                         onClick={() => navigate(`/seller/debtor/${row.id}`)}/></>
            )
        },
        {
            name: 'F.I.O',
            width: '150px',
            wrap: true,
            selector: (row: ClientDataProps) => row.clientName
        },
        {
            name: "Telefon raqami",
            width: '150px',
            wrap: true,
            selector: (row: ClientDataProps) => row.clientPhone
        },
        {
            name: "Qarzdorligi",
            width: '150px',
            wrap: true,
            cell: (row: ClientDataProps) => row?.debtSum
        },
        {
            name: 'Qaytarish sanasi',
            wrap: true,
            width: '150px',
            cell: (row: ClientDataProps) => <DateFormatComponent currentDate={row.clientPaymentDate}/>
        },
        {
            name: 'Manzili',
            wrap: true,
            width: '150px',
            selector: (row: ClientDataProps) => row.clientAdress
        },
        {
            name: 'Holat',
            width: '100px',
            cell: (row: ClientDataProps) => (
                <div className={'flex gap-2'}>
                    <BiPencil width={30} className={"cursor-pointer text-orange-500 text-base"}
                              onClick={() => {
                                  setClient(row)
                                  toggleDebt()
                              }}
                    />
                </div>
            )
        }
    ]

    return (
        <div>
            <div className="w-full flex items-center justify-between mb-3 overflow-ellipsis overflow-hidden">
                <BreadcumbsComponent data={breadCumbc}/>
                <div className="">
                    <ButtonComponent onClick={handleFilter} className="border border-green" outline
                                     label={<FaFilter size={16} className={'text-green'}/>}/>
                </div>
            </div>
            <Card>
                <CardBody>
                    <TableComponent
                        data={clients}
                        size={clients.length}
                        limit={limit}
                        columns={basicColumns}
                        progressPending={loading}
                        totalPages={pageCount}
                        currentPage={currentPage}
                        totalCount={totalCount}
                    />
                </CardBody>
            </Card>
            <DebtorSidebar totalPrice={1000} open={isDebt} toggle={toggleDebt} debtUser={client}/>
            <FilterDebts open={filter} toggle={handleFilter}/>
        </div>
    );
}
