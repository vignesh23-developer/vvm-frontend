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
        <p className="mb-8 text-lg text-gray-600 text-center font-medium">
          {topText}
        </p>
      )}

      {/* Steps */}
      <div className="flex w-full max-w-5xl justify-between relative px-6">
        {steps.map((step, idx) => {
          const isActive = idx + 1 === currentStep
          const isCompleted = idx + 1 < currentStep
          const isLast = idx === steps.length - 1

          return (
            <div key={idx} className="flex flex-col items-center relative flex-1">
              {/* Circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full border-2 z-10 transition-all duration-300
                  ${
                    isCompleted || isActive
                      ? 'bg-[#7B1E1E] border-[#7B1E1E] text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
              >
                {step.icon}
              </div>

              {/* Text */}
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-semibold ${
                    isActive ? 'text-gray-900' : 'text-gray-600'
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

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 ${
                    isCompleted ? 'bg-[#7B1E1E]' : 'bg-gray-300'
                  }`}
                  style={{ zIndex: 1 }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StepperComponent
