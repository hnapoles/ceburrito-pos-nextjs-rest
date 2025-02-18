'use client'

import { StoreData } from "@/app/model/stores-model";
import { Lookup } from "@/app/model/lookups-model";

import StoreUpdateForm from "./store-update-form";
import StoreUpdateTabs from "./store-update-tabs";


export default function StoreUpdate({ store }: { store: StoreData }) {

    
    return (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Store Image and Details */}
            <div>
                <StoreUpdateForm store={store}  />
            </div>
            
            {/* Right Side - Store Tabs */}
            <div>
                <StoreUpdateTabs store={store}/>
            </div>

        </div>
    )

}