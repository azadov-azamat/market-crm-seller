// import React from 'react';

import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {BreadCumbsDataProps} from "../../interface/modal/modal.interface.ts";
import {formatter, getCheckFile, getMgId} from "../../config/servise.ts";
import BreadcumbsComponent from "../../components/page-title/breadcumbs.tsx";
import React from "react";
import {getSales, getStores} from "../../redux/reducers/variable.ts";
import {Button, Card, CardBody, Typography} from "@material-tailwind/react";
import {useLocation, useNavigate} from "react-router-dom";
import DateFormatClockComponent from "../../components/date-format/oclock.tsx";
import {HiQrCode} from 'react-icons/hi2'
import qs from "qs";
import FilterSales from "./filter.tsx";
import {FaFilter} from "react-icons/fa";
import CustomPagination from "../../custom-pagination.tsx";

interface SoldProductProps {
    clientId?: number;
}

export default function SoldProducts({clientId}: SoldProductProps) {

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()

    const {
        stores,
        sales,
        client,
        pageCount,
        totalCount,
        currentPage,
        limit,
        userData
    } = useAppSelector(state => state.variables)
    const query = qs.parse(location.search, {ignoreQueryPrefix: true})

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
            name: "Sotilgan mahsulotlar",
            link: ``
        }
    ]

    React.useEffect(() => {
        if (clientId) {
            navigate({
                search: qs.stringify({
                    filter: JSON.stringify({clientId: clientId})
                })
            })
        } else {
            navigate({
                search: qs.stringify({
                    filter: JSON.stringify({sellerId: userData?.id})
                })
            })
        }
    }, [clientId])

    React.useEffect(() => {
        if (clientId) {
            dispatch(getSales({
                filter: JSON.stringify({clientId: clientId})
            }))
        } else if (location.search) {
            dispatch(getSales({...query, limit: 10, sort: '-id', filter: JSON.stringify({storeId: getMgId()})}))
        } else {
            dispatch(getSales({limit: 10,sort: '-id', filter: JSON.stringify({storeId: getMgId()})}))
        }
    }, [location.search, client])

    React.useEffect(() => {
        dispatch(getStores())

        return () => {
            dispatch({
                type: "sale/getSales/fulfilled",
                payload: {
                    data: []
                }
            })
        }
    }, [])

    const handlePaginate = (page: number) => {
        dispatch(getSales({
            ...query,
            limit: 10,
            sort: '-id',
            filter: JSON.stringify({storeId: getMgId()}),
            page: page || 0
        }))
    }

    return (
        <div>
            {!client && <div className="w-full overflow-ellipsis overflow-hidden">
                <BreadcumbsComponent data={breadCumbc}/>
            </div>}
            <div className="mb-3 flex justify-between">
                <Button onClick={handleFilter} className="btn-icon hidden">
                    <FaFilter size={16}/>
                </Button>
            </div>
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                {
                    sales.map((item, ind) => {
                        return (
                            <Card key={ind}
                                  className="relative"
                            >
                                <CardBody onClick={() => navigate(`/seller/sold-product/${item?.id}`)}
                                          className="cursor-pointer">
                                    <div className="">
                                        <Typography variant="paragraph"
                                                    className="text-base font-bold">#{item?.id} {item?.store?.storeName}</Typography>
                                    </div>
                                    <div className="flex">
                                        <Typography variant="small"
                                                    className="text-base font-bold">Sotuvchi: &nbsp;</Typography>
                                        <Typography variant="small"
                                                    className="text-base"> {item?.seller?.sellerName}</Typography>
                                    </div>

                                    <div className="flex">
                                        <Typography variant="small" className="text-base font-bold">Umumiy
                                            narxi: &nbsp;</Typography>
                                        <Typography variant="small"
                                                    className="text-base"> {formatter.format(item?.saleMainPrice)}</Typography>
                                    </div>

                                    <div className="flex">
                                        <Typography variant="small" className="text-base font-bold">Sotilgan
                                            narxi: &nbsp;</Typography>
                                        <Typography variant="small"
                                                    className="text-base"> {formatter.format(item?.saleSoldPrice)}</Typography>
                                    </div>

                                    <div className="flex">
                                        <Typography variant="small" className="text-base font-bold">Sotuv
                                            sanasi: &nbsp;</Typography>
                                        <Typography variant="small" className="text-base"><DateFormatClockComponent
                                            currentDate={item?.createdAt}/></Typography>
                                    </div>
                                    {
                                        item?.soldproducts?.length > 0 && <div className="sold-product my-2">
                                            <Typography variant="paragraph">Sotilgan mahsulotlar: </Typography>
                                            <div className="flex ">
                                                <div className="w-4/12 text-base font-bold">Nomi</div>
                                                <div className="w-6/12 text-base font-bold">Naxi</div>
                                                <div className="w-2/12 text-base font-bold">Soni</div>
                                            </div>
                                            <div className="">
                                                {
                                                    item.soldproducts.map((pr, ip) => {
                                                        return (
                                                            <div className="flex" key={ip}>
                                                                <div className="w-4/12">{pr?.soldProductName}</div>
                                                                <div
                                                                    className="w-5/12">{formatter.format(pr?.soldPrice)}</div>
                                                                <div
                                                                    className="w-3/12">{pr?.soldQuantity} {pr?.soldProductMeasure}</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                    <div className="flex ">
                                        <Typography variant="small"
                                                    className="text-base font-bold">Sharx: &nbsp;</Typography>
                                        <Typography variant="small" className="text-base"> {item?.comment}</Typography>
                                    </div>
                                </CardBody>
                                {item?.saleDebt && <div
                                    className="absolute text-xs px-2 bg-red-500 text-white rounded right-1 top-1">qarz-savdo</div>}
                                <div className="absolute text-3xl cursor-pointer bottom-2 right-2">
                                    <HiQrCode onClick={() => getCheckFile(item?.id || 0)}/>
                                    {/*<a href={baseUrl + `/sales/file/${item?.id}`}>*/}
                                    {/*    <HiQrCode/>*/}
                                    {/*</a>*/}
                                </div>
                            </Card>
                        )
                    })
                }
            </div>
            <div className="">
                <CustomPagination
                    limit={limit}
                    size={sales.length}
                    totalCount={totalCount}
                    totalPages={pageCount}
                    currentPage={currentPage}
                    handlePaginate={handlePaginate}
                />
            </div>
            <FilterSales open={filter} toggle={handleFilter}/>
        </div>
    );
}