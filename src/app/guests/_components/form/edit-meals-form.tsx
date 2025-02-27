import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { Meals } from '@/types/meals'
import { uuidv4 } from '@/lib/utils'
import { Main, Pudding, Starter } from '@/server/db/schema'
import { Button } from '@/components/ui/button'
import { IconTrash } from '@tabler/icons-react'

export function EditMealsForm(props: {
  meals: Meals
  onMealsChange: (meals: Meals) => void
}) {
  const [localMeals, setLocalMeals] = useState<Meals>(props.meals)
  const [newMainItem, setNewMainItem] = useState('')
  const [newStarterItem, setNewStarterItem] = useState('')
  const [newPuddingItem, setNewPuddingItem] = useState('')

  useEffect(() => {
    setLocalMeals(props.meals)
  }, [props.meals])

  const handleAddMainItem = () => {
    if (newMainItem) {
      const updatedMeals = {
        ...localMeals,
        mains: [...localMeals.mains, { id: uuidv4(), text: newMainItem }]
      }
      setLocalMeals(updatedMeals)
      props.onMealsChange(updatedMeals)
      setNewMainItem('')
    }
  }

  const handleAddStarterItem = () => {
    if (newStarterItem) {
      const updatedMeals = {
        ...localMeals,
        starters: [
          ...localMeals.starters,
          { id: uuidv4(), text: newStarterItem }
        ]
      }
      setLocalMeals(updatedMeals)
      props.onMealsChange(updatedMeals)
      setNewStarterItem('')
    }
  }

  const handleAddPuddingItem = () => {
    if (newPuddingItem) {
      const updatedMeals = {
        ...localMeals,
        puddings: [
          ...localMeals.puddings,
          { id: uuidv4(), text: newPuddingItem }
        ]
      }
      setLocalMeals(updatedMeals)
      props.onMealsChange(updatedMeals)
      setNewPuddingItem('')
    }
  }

  const handleDeleteStarterItem = (id: string) => {
    const updatedMeals = {
      ...localMeals,
      starters: localMeals.starters.filter((item) => item.id !== id)
    }
    setLocalMeals(updatedMeals)
    props.onMealsChange(updatedMeals)
  }

  const handleDeleteMainItem = (id: string) => {
    const updatedMeals = {
      ...localMeals,
      mains: localMeals.mains.filter((item) => item.id !== id)
    }
    setLocalMeals(updatedMeals)
    props.onMealsChange(updatedMeals)
  }

  const handleDeletePuddingItem = (id: string) => {
    const updatedMeals = {
      ...localMeals,
      puddings: localMeals.puddings.filter((item) => item.id !== id)
    }
    setLocalMeals(updatedMeals)
    props.onMealsChange(updatedMeals)
  }

  return (
    <div className='grid gap-4 p-4'>
      <div>
        <h3>Starter Items</h3>
        <ul>
          {localMeals?.starters.map((item: Starter) => (
            <li
              key={item.id}
              className='p-2 rounded-md mb-1 cursor-pointer transition'
            >
              <span>{item.text}</span>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => handleDeleteStarterItem(item.id)}
                className='h-8 px-2'
              >
                <IconTrash className='h-4 w-4' />
              </Button>
            </li>
          ))}
        </ul>
        <div className='flex items-center gap-2'>
          <Input
            value={newStarterItem}
            onChange={(e) => setNewStarterItem(e.target.value)}
            placeholder='Add Starter Option'
          />
          <Button
            variant='default'
            type='button'
            onClick={handleAddStarterItem}
            className='w-56'
          >
            Add Starter Option
          </Button>
        </div>
      </div>

      <div>
        <h3>Main Items</h3>
        <ul>
          {localMeals?.mains.map((item: Main) => (
            <li
              key={item.id}
              className='p-2 rounded-md mb-1 cursor-pointer transition'
            >
              <span>{item.text}</span>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => handleDeleteMainItem(item.id)}
                className='h-8 px-2'
              >
                <IconTrash className='h-4 w-4' />
              </Button>
            </li>
          ))}
        </ul>
        <div className='flex items-center gap-2'>
          <Input
            value={newMainItem}
            onChange={(e) => setNewMainItem(e.target.value)}
            placeholder='Add Main Option'
          />
          <Button
            variant='default'
            type='button'
            onClick={handleAddMainItem}
            className='w-56'
          >
            Add Main Option
          </Button>
        </div>
      </div>

      <div>
        <h3>Pudding Items</h3>
        <ul>
          {localMeals?.puddings.map((item: Pudding) => (
            <li
              key={item.id}
              className='p-2 rounded-md mb-1 cursor-pointer transition'
            >
              <span>{item.text}</span>
              <Button
                variant='destructive'
                size='sm'
                onClick={() => handleDeletePuddingItem(item.id)}
                className='h-8 px-2'
              >
                <IconTrash className='h-4 w-4' />
              </Button>
            </li>
          ))}
        </ul>
        <div className='flex items-center gap-2'>
          <Input
            value={newPuddingItem}
            onChange={(e) => setNewPuddingItem(e.target.value)}
            placeholder='Add Pudding Option'
          />
          <Button
            variant='default'
            type='button'
            onClick={handleAddPuddingItem}
            className='w-56'
          >
            Add Pudding Option
          </Button>
        </div>
      </div>
    </div>
  )
}
