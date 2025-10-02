import { NavigationButtonsProps } from '../../data/types/sellerTypes'

export default function NavigationButtons({
  currentStep,
  totalSteps,
  handlePrev,
  handleNext,
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-gray-100 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentStep === 1}
        className="px-6 py-3 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Previous
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="px-8 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
      >
        {currentStep === totalSteps ? 'Submit' : 'Next Step →'}
      </button>
    </div>
  )
}
