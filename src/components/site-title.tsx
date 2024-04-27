import { Icon24Hours } from '@tabler/icons-react'

const SiteTitle = () => {
  return (
    // TODO Replace icon with correct branding
    <div className='flex align-middle'>
      <Icon24Hours
        size={24}
        className='text-foreground'
        stroke={2}
        strokeLinejoin='miter'
      />
      <p className='text-foreground max-lg:hidden font-black pl-3'>
        Big Day Planner
      </p>
    </div>
  )
}

export default SiteTitle
