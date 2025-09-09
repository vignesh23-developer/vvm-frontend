'use server'

import { cookies } from "next/headers"
import { CookiesName } from "./cookiesConst";

export const onSetCookies = async (cookiesName: string, data: any) => {
    try {
        const cookiesStore = await cookies();
        cookiesStore.set({
            name: cookiesName,
            value: JSON.stringify(data),
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: "strict",
        })
        return { isError: false, message: "cookies set successfully" };
    } catch (e: any) {
        return { isError: true, message: "Error on Creating Cookies" };
    }
}

export const onGetCookies = async (cookiesName: string) => {
    try {
        const cookiesStore = await cookies();
        const cookiesData = cookiesStore.get(cookiesName)?.value || null;

        const parsedCookies = typeof cookiesData === "string" ? JSON.parse(cookiesData) : cookiesData;
        return { isError: false, message: '', cookies: parsedCookies };
    } catch (e: any) {
        console.log("Error on Get Cookies:", e);
        return { isError: true, message: "Error on Get Cookies" };
    }
}

export const onDeleteCookies = async (cookiesName: string) => {
    try {
        const cookiesStore = await cookies();
        cookiesStore.delete(cookiesName);

        return { isError: false, message: "Cookies deleted successfully" };
    } catch (e: any) {
        return { isError: true, message: "Error on Delete Cookies" };
    }
}

// export const onUpdateCookies = () => { }