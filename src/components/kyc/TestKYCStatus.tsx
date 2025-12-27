import React from 'react'
import { postMethod } from '@/services/service';
import { testAppEndpoints } from '@/services/endpoints';
import toast from 'react-hot-toast';

const TestKYCStatus = () => {

    const handleTestKYCCompletion = async () => {
        const response = await postMethod(testAppEndpoints.testKycNotification, { userName: "Akram" });
        console.log(response.data);
    }

    return (
        <button onClick={handleTestKYCCompletion}
            className={`px-6 py-2 rounded font-medium transition-colors bg-[#2a1407] text-white hover:bg-[#5a2a0a] w-full`}
        >
            Test KYC COMPLETION
        </button>
    )
}

export default TestKYCStatus