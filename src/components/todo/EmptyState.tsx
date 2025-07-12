import ResponsiveIcon from '../icon/ResponsiveIcon'

interface EmptyStateProps {
  iconName: string
  messageLine1: string
  messageLine2: string
}

export default function EmptyState({
  iconName,
  messageLine1,
  messageLine2,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6">
      <ResponsiveIcon name={iconName} alt={`Empty ` + iconName} />
      <div className="font-bold text-slate4 text-center leading-[18px]">
        <p>{messageLine1}</p>
        <p>{messageLine2}</p>
      </div>
    </div>
  )
}
