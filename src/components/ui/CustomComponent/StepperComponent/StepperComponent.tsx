'use client'

import React from 'react'

interface Step {
  title: string
  subtitle: string
  icon: React.ReactNode
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  topText?: string
}

const StepperComponent: React.FC<StepperProps> = ({
  steps,
  currentStep,
  topText,
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Top text */}
      {topText && (
        <p className="mb-6 text-lg text-gray-500 text-center max-w-md">
          {topText}
        </p>
      )}

      {/* Steps */}
      <div className="flex w-full max-w-5xl justify-between relative overflow-x-auto px-4 no-scrollbar">
        {steps.map((step, idx) => {
          const isActive = idx + 1 === currentStep
          const isCompleted = idx + 1 < currentStep
          const isLast = idx === steps.length - 1

          return (
            <div
              key={idx}
              className="flex flex-col items-center flex-1 relative min-w-[80px]"
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Circle */}
              <div
                className={`w-10 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ease-in-out ${
                  isCompleted || isActive
                    ? 'bg-[#7B1E1E] border-[#7B1E1E] text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {step.icon}
              </div>

              {/* Text */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p
                  className={`text-xs ${
                    isActive ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.subtitle}
                </p>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="absolute top-6 left-1/2 w-full translate-x-1/2">
                  <div
                    className={`h-0.5 w-full ${
                      isCompleted ? 'bg-[#7B1E1E]' : 'bg-gray-300'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StepperComponent
