"use server";
import { CookiesName } from "@/utils/cookies/cookiesConst";
import { onDeleteCookies, onGetCookies } from "@/utils/cookies/cookiesHelper";
import { redirect } from "next/navigation";
import axios from "axios";

const apiInstance = axios.create({
    baseURL: process.env.TES_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

apiInstance.interceptors.request.use(
    async (config) => {
        // console.log("Req Config Interceptors : ", config);

        const cookies = await onGetCookies(CookiesName.userInfo);
        // console.log("Req Get Cookies :", cookies);

        const accessToken = cookies.cookies?.access_token?.value?.token;
        // console.log("Req Get Access Token :", accessToken);

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        else {
            config.headers["Authorization"] = "";
        }

        return config;
    }
);

apiInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // console.log("Res Status Interceptors :", error.response?.status); // Fix: Access status correctly
        if (error.response?.status === 401) {
            await onDeleteCookies(CookiesName.userInfo);
            return Promise.reject(error);

            // redirect("/signin");
            // window.location.href = "/signin";
        }

        return Promise.reject(error); // Ensure error is thrown
    }
);

// apiInstance.interceptors.response.use((config) => {
//     return config;
// },
//     async (error) => {
//         console.log("Res Status Interceptors :", error.status);
//         if (error.status === 401) {
//             await onDeleteCookies(CookiesName.userInfo);
//             window.location.href = "/signin"
//         }
//     }
// );

export default apiInstance;