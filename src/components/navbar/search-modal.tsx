import React, {useEffect} from 'react';
import {filterProduct} from "../../redux/reducers/variable.ts";
import DialogModal from "../modal/dialog";
import {Typography} from "@material-tailwind/react";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {ModalInterfaceProps} from "../../interface/modal/modal.interface.ts";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import * as InputComponent from "../inputs";
import {noIMG} from "../../config/api.ts";
import {formatter} from "../../config/servise.ts";

export default function SearchModal({toggle, open}: ModalInterfaceProps) {

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {fltProduct} = useAppSelector(state => state.variables)

    const [search, setSearch] = React.useState<string>("")

    useEffect(() => {
        if (search.length !== 0) {
            dispatch(filterProduct(search))
        } else {
            dispatch(filterProduct(""))
        }
    }, [search])

    return (
        <DialogModal open={open} toggle={toggle}>
            <div className="relative w-full">
                <InputComponent.Text
                    name={"search"}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={"Mahsulotlarni nomini yoki narxini kiriting"}
                    label={"Mahsulotlarni qidirish"}/>

                {
                    fltProduct.map((item, ind) =>
                        <div key={ind} className={"flex my-2 border rounded p-1 cursor-pointer"}
                             onClick={() => {
                                 navigate(`/seller/product/${item.id}`)
                                 setSearch("")
                                 toggle()
                             }}
                        >
                            <div className="w-2/12 h-20">
                                <LazyLoadImage effect={"black-and-white"}
                                               className={"object-cover object-center h-20"}
                                               alt={item.productName}
                                               src={item.productImgUrl || noIMG}
                                />
                            </div>
                            <div className="w-10/12 flex flex-col justify-between pl-3">
                                <Typography variant={"small"}
                                            className={"font-bold text-sm"}>
                                    {item.productName}
                                </Typography>
                                <div className="w-full flex justify-between">
                                    <Typography variant={"small"} className={"font-bold text-xs"}>
                                        {formatter.format(item.productPrice)}
                                    </Typography>
                                    <Typography variant={"small"} className={"font-medium text-xs"}>
                                        Miqdori: {item.productQuantity} {item.productMeasure}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </DialogModal>
    );
}