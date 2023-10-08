import { useEffect, useState } from "react";
import { deleteIcon, searchIcon } from "../assets";
import User, { Users } from "../service/User"
import { toast } from "react-toastify";
const Home = () => {
    const { data: users, isLoading, isError } = User.getUser();
    const [isSearch, setSearch] = useState(false);
    const [searchString, setSearchString] = useState("")
    const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [favouriteUser, setFavouriteUser] = useState<Users>()
    const [favouriteData, setfavouriteData] = useState<any>([]);
    const [usersData, setUserData] = useState<Users[]>([])
    const saveDataToLocalStorage = () => {
        if (!users) return;
        if (localStorage.getItem("userData")) {
            const storedUserJson = localStorage.getItem('userData');
            if (storedUserJson)
                setUserData(JSON.parse(storedUserJson))
            return;
        };
        localStorage.setItem('userData', JSON.stringify(users));
        const storedUserJson = localStorage.getItem('userData');
        if (storedUserJson)
            setUserData(JSON.parse(storedUserJson))

    };

    useEffect(() => {
        saveDataToLocalStorage()
        const storedDataJson = localStorage.getItem('favouriteUsers');
        if (storedDataJson) {
            const storedData = JSON.parse(storedDataJson);
            setfavouriteData(storedData);
        }
    }, [users]);

    const filterSearch = (value: string) => {
        if (value !== "") {
            const filteredUsersArray = usersData?.filter(user =>
                user.email.toLowerCase().includes(value) ||
                user.first_name.toLowerCase().includes(value) ||
                user.last_name.toLowerCase().includes(value)
            );
            if (filteredUsersArray?.length == 0) {
                setFilteredUsers([]);
            }

            setFilteredUsers(filteredUsersArray as Users[]);
        } else {
            setFilteredUsers([]);
        }
    }
    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const onSelectChange = (sort: string) => {
        let sortedData = [...usersData];
        switch (sort) {
            case "0": {
                const storedUserJson = localStorage.getItem('userData');
                if (storedUserJson) {
                    const originalUser: Users[] = JSON.parse(storedUserJson)
                    sortedData = [...originalUser];
                }
                break
            }
            case "1":
                sortedData.sort((a, b) => a.first_name.localeCompare(b.first_name));
                break;
            case "2":
                sortedData.sort((a, b) => a.last_name.localeCompare(b.last_name));
                break;
            case "3":
                sortedData.sort((a, b) => a.email.localeCompare(b.email));
                break;
            default:
                break;
        }
        console.log(sortedData);
        setUserData(sortedData);
    }

    const handleAddData = (data: Users) => {
        const itemExists = favouriteData.some((item: Users) => item.email === data.email);
        if (itemExists) {
            return toast("Already added to Favourite..", { type: "error" })
        }
        const newItemData = { ...data, id: favouriteData.length + 1 }
        setfavouriteData((prevData: any) => [...prevData, newItemData]);
        const updatedDataJson = JSON.stringify([...favouriteData, newItemData]);
        localStorage.setItem('favouriteUsers', updatedDataJson);
        toast("Favourite Added", { type: "success" })
    };

    const deleteUser = (email: string) => {
        const storedDataJson = localStorage.getItem('userData');
        let storedData: Users[] = [];

        if (storedDataJson) {
            storedData = JSON.parse(storedDataJson);
        }
        const indexToDelete = storedData.findIndex((item) => item.email === email);

        if (indexToDelete !== -1) {
            storedData.splice(indexToDelete, 1);
            const updatedDataJson = JSON.stringify(storedData);
            localStorage.setItem('userData', updatedDataJson);
            const storedUserJson = localStorage.getItem('userData');
            setUserData([])
            if (storedUserJson)
                setUserData(JSON.parse(storedUserJson))
        } else {
            toast('Item not found in local storage.', { type: "error" });
        }
    };


    return (
        <div>
            {isLoading ? "Loading.." : ""}
            {isError ? "Error occured while fetching the users" : ""}
            <div className=" flex justify-center items-center">
                <div className="w-full lg:w-2/6 ">
                    <div className="bg-[#3F51B5]  px-4 py-2">
                        <div className="flex justify-between items-center">
                            <select className="bg-inherit text-white outline-none border-none py-4" onChange={(e) => {
                                // saveDataToLocalStorage()
                                onSelectChange(e.target.value);
                            }}>
                                <option value="0" className="text-black">ALL</option>
                                <option value="1" className="text-black">First Name</option>
                                <option value="2" className="text-black">Last Name</option>
                                <option value="3" className="text-black">Email</option>
                            </select>
                            <img src={searchIcon} alt="" className="h-8 w-8 cursor-pointer" onClick={() => setSearch(!isSearch)} />
                        </div>
                        {isSearch && (<input type="text" className="block w-full  text-black outline-none border-none bg-white rounded-lg px-4 py-2" placeholder="search user.." onChange={(e) => { filterSearch(e.target.value); setSearchString(e.target.value) }} />)}
                    </div>
                    <h2 className="text-center text-2xl font-medium mt-4">User List</h2>
                    <div className="px-4">
                        {(isSearch) ? (searchString) ? filteredUsers?.map(user => userDataCard(user)) : usersData?.map(user => userDataCard(user)) : usersData?.map(user => userDataCard(user))}
                    </div>

                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 flex  items-center justify-center z-50 ">
                    <div className="modal-container">
                        <div className="bg-blue-800 w-96 p-4 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-white">Add to Favourite</h2>
                            <div className="flex flex-col justify-center items-center space-y-3 mt-6">
                                <img src={favouriteUser?.avatar} alt="Favourite User Avatar" className="h-40 w-4h-40 rounded-full " />
                            </div>
                            <p className="text-center text-white font-medium mt-6">{`${favouriteUser?.first_name} ${favouriteUser?.last_name}`}</p>
                            <div className="flex space-x-4 mt-6 justify-center">
                                <button className="bg-white rounded-lg text-black px-4 py-1.5" onClick={() => {
                                    handleAddData(favouriteUser!);
                                    closeModal();
                                }}>Add</button>
                                <button className="bg-red-500 rounded-lg text-white px-4 py-1.5 " onClick={closeModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
    function userDataCard(data: Users) {
        return (<div key={data.email} className="flex my-4 items-center cursor-pointer border-b-2 pb-2 transition-all duration-300 border-b-transparent hover:border-b-2 hover:border-b-gray-500" >
            <div className="flex flex-1" onClick={() => {
                openModal();
                setFavouriteUser(data)
            }}>
                <img src={data.avatar} alt="User Image" className="rounded-full h-10 w-10" />
                <div className="ms-4 w-72">
                    <h2 className="font-medium">{`${data.first_name} ${data.last_name}`}</h2>
                    <h2 className="">{data.email}</h2>
                </div>
            </div>
            <div className="bg-red-500 rounded-full p-2 transition-all duration-300 hover:scale-105 " onClick={() => deleteUser(data.email)}>
                <img src={deleteIcon} alt="Delete Icon" className="h-6 w-6" />
            </div>
        </div>)
    }

}


export default Home