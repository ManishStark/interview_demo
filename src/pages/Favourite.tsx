import { useEffect, useState } from "react"
import { Users } from "../service/User";
import { deleteIcon } from "../assets";
import { toast } from "react-toastify";

const Favourite = () => {
    const [localData, setLocalData] = useState<any>([]);

    const getLocalData = () => {
        const storedDataJson = localStorage.getItem('favouriteUsers');
        if (storedDataJson) {
            const storedData = JSON.parse(storedDataJson);
            setLocalData(storedData);
        }
    }
    useEffect(() => {
        getLocalData()
    }, []);

    const deleteData = (email: string) => {
        // Retrieve existing data from local storage
        const storedDataJson = localStorage.getItem('favouriteUsers');
        let storedData: Users[] = [];

        if (storedDataJson) {
            storedData = JSON.parse(storedDataJson);
        }

        // Find the index of the item to be deleted
        const indexToDelete = storedData.findIndex((item) => item.email === email);

        if (indexToDelete !== -1) {
            // Remove the item from the data array
            storedData.splice(indexToDelete, 1);

            // Update local storage with the modified data
            const updatedDataJson = JSON.stringify(storedData);
            localStorage.setItem('favouriteUsers', updatedDataJson);

            toast('Item deleted from local storage.', { type: "success" });
            getLocalData()
        } else {
            toast('Item not found in local storage.', { type: "error" });
        }
    };

    return (
        <div>
            <div className="px-4">
                {localData.map((user: Users) => userData(user))}
                {localData.length == 0 && (<p className="text-red-500 text-2xl">No Favourites Found..!</p>)}

            </div>
        </div>

    )

    function userData(data: Users) {
        return (<div key={data.email} className="flex items-center my-4 cursor-pointer border-b-2 pb-2 transition-all duration-300 border-b-transparent hover:border-b-2 hover:border-b-gray-500 w-fit" >
            <img src={data.avatar} alt="User Image" className="rounded-full h-10 w-10" />
            <div className="ms-4 w-96">
                <h2 className="font-medium">{`${data.first_name} ${data.last_name}`}</h2>
                <h2 className="">{data.email}</h2>
            </div>
            <div className="bg-red-500 rounded-full p-2 transition-all duration-300 hover:scale-105" onClick={() => deleteData(data.email)}>
                <img src={deleteIcon} alt="Delete Icon" className="h-6 w-6" />
            </div>
        </div>)
    }
}

export default Favourite