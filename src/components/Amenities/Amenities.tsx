import {
  Car,
  Trees,
  AirVent,
  WashingMachine,
  Droplet,
  FireExtinguisher,
  Shield,
  CigaretteOff,
} from 'lucide-react'

const Amenities = ({ lanJson }: any) => {
  const amenityList = [
    {
      icon: AirVent, // closest to AC
      label: 'Air Conditioner',
    },
    {
      icon: Car,
      label: 'Car Parking',
    },
    {
      icon: Trees, // represents balcony/garden
      label: 'Balcony',
    },
    {
      icon: WashingMachine,
      label: 'Washer',
    },
    {
      icon: Droplet,
      label: 'Pool Access',
    },
    {
      icon: FireExtinguisher,
      label: 'Fire Extinguisher',
    },
    {
      icon: Shield, // closest to security camera
      label: 'Security Camera',
    },
    {
      icon: CigaretteOff,
      label: 'Smoke Detectors',
    },
  ]

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">
        {lanJson('PropertiesDetails.amenities')}
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
        {amenityList.map((item, i) => (
          <span key={i}>
            <item.icon className="inline mr-2" /> {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Amenities
