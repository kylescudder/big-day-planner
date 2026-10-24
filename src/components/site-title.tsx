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
      <p className='text-foreground pl-3 font-black max-lg:hidden'>
        Big Day Planner
      </p>
    </div>
  )
}

export default SiteTitle
