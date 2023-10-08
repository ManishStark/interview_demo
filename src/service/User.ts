import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import apiClient from "./apiClient";

export interface Users {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
interface UserFetchResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: Users[];
}

const getUserApiCall = () =>
  apiClient
    .get<UserFetchResponse>("users")
    .then((res) => res.data.data)
    .catch((err) => err.message);

class User {
  getUser = () => {
    const { data, isLoading, isError } = useQuery<Users[], AxiosError>({
      queryKey: ["users"],
      queryFn: getUserApiCall,
    });
    return { data, isLoading, isError };
  };
}

export default new User();
