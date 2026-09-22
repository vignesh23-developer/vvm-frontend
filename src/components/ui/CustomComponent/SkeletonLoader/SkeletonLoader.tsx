'use client'

import React from 'react'

export default function SkeletonLoader() {
  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-md overflow-hidden w-full animate-pulse">
      {/* Left Section */}
      <div className="flex flex-col lg:flex-row gap-4 p-3 flex-1">
        {/* Image + Agent */}
        <div className="flex flex-col items-start w-full sm:w-auto">
          <div className="w-full sm:w-[250px] h-40 bg-gray-200 rounded-md"></div>
          <div className="mt-3 space-y-2 w-full">
            <div className="h-3 w-28 bg-gray-200 rounded"></div>
            <div className="h-2 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between flex-1 w-full">
          {/* Title + Icons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-3 w-full bg-[#F5F5F5] rounded-md flex flex-col sm:flex-row justify-between divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-sm">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-3 flex-1">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                  <div className="h-2 w-16 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-3 space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-between bg-[#ECECEC] p-4 w-full lg:w-[240px]">
        {/* Price */}
        <div className="text-left lg:text-right space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded ml-auto"></div>
          <div className="h-3 w-24 bg-gray-200 rounded ml-auto"></div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full mt-4">
          <div className="h-9 w-full bg-gray-300 rounded-full"></div>
          <div className="h-9 w-full bg-gray-200 rounded-full"></div>
          <div className="h-2 w-32 bg-gray-200 rounded mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  )
}
