import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { Meals } from '@/types/meals'
import { uuidv4 } from '@/lib/utils'
import { Main, Pudding, Starter } from '@/server/db/schema'
import { Button } from '@/components/ui/button'

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

  return (
    <div className='grid gap-4 p-4'>
      <div>
        <h3>Starter Items</h3>
        <ul>
          {localMeals?.starters.map((item: Starter) => (
            <li
              key={item.id}
              className='bg-gray-100 p-2 rounded-md mb-1 hover:bg-gray-200 transition'
            >
              {item.text}
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
              className='bg-gray-100 p-2 rounded-md mb-1 hover:bg-gray-200 transition'
            >
              {item.text}
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
              className='bg-gray-100 p-2 rounded-md mb-1 hover:bg-gray-200 transition'
            >
              {item.text}
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
