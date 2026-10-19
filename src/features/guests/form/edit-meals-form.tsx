import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { Meals } from '@/types/meals'
import { uuidv4 } from '@/lib/utils'
import { Main, Pudding, Starter } from '@/server/db/schema'
import { Button } from '@/components/ui/button'
import { IconTrash } from '@tabler/icons-react'
import { MealType } from '@/consts/meals'

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

  const handleDeleteMealItem = (id: string, type: MealType) => {
    let updatedMeals

    switch (type) {
      case 'starter':
        updatedMeals = {
          ...localMeals,
          starters: localMeals.starters.filter((item) => item.id !== id)
        }
        break
      case 'main':
        updatedMeals = {
          ...localMeals,
          mains: localMeals.mains.filter((item) => item.id !== id)
        }
        break
      case 'pudding':
        updatedMeals = {
          ...localMeals,
          puddings: localMeals.puddings.filter((item) => item.id !== id)
        }
        break
      default:
        console.error('Unknown meal type:', type)
        return
    }

    setLocalMeals(updatedMeals)
    props.onMealsChange(updatedMeals)
  }

  const renderMenuItem = (meal: Starter | Main | Pudding, type: MealType) => (
    <li
      key={meal.id}
      className='flex items-center justify-between py-2 px-4 hover:bg-muted/50 rounded-md'
    >
      <span>{meal.text}</span>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => handleDeleteMealItem(meal.id, type)}
        aria-label='Delete taxi'
      >
        <IconTrash className='h-4 w-4' />
      </Button>
    </li>
  )

  const listStyle = 'overflow-y-auto max-h-64 space-y-1 my-4'

  const newItemMap: Record<MealType, string> = {
    starter: newStarterItem,
    main: newMainItem,
    pudding: newPuddingItem
  }

  const setNewItemMap: Record<
    MealType,
    React.Dispatch<React.SetStateAction<string>>
  > = {
    starter: setNewStarterItem,
    main: setNewMainItem,
    pudding: setNewPuddingItem
  }
  const handleAddItemMap: Record<MealType, () => void> = {
    starter: handleAddStarterItem,
    main: handleAddMainItem,
    pudding: handleAddPuddingItem
  }

  const renderAddItem = (newItem: string, type: MealType) => (
    <div className='flex items-center gap-2'>
      <Input
        value={newItemMap[type]}
        onChange={(e) => setNewItemMap[type](e.target.value)}
      />
      <Button
        variant='default'
        type='button'
        onClick={handleAddItemMap[type]}
        className='w-56'
      >
        {`Add ${type.toLowerCase()} option`}
      </Button>
    </div>
  )

  return (
    <div className='grid gap-4 p-4'>
      <div>
        <h3>Starter Items</h3>
        {localMeals?.starters.length > 0 ? (
          <ul className={listStyle}>
            {localMeals.starters.map((starter: Starter) =>
              renderMenuItem(starter, MealType.STARTER)
            )}
          </ul>
        ) : (
          <div className='text-center py-4 text-muted-foreground'>
            No starters added yet. Add your first starter below.
          </div>
        )}
        {renderAddItem(newStarterItem, MealType.STARTER)}
      </div>

      <div>
        <h3>Main Items</h3>
        {localMeals?.mains.length > 0 ? (
          <ul className={listStyle}>
            {localMeals.mains.map((main: Main) =>
              renderMenuItem(main, MealType.MAIN)
            )}
          </ul>
        ) : (
          <div className='text-center py-4 text-muted-foreground'>
            No mains added yet. Add your first main below.
          </div>
        )}
        {renderAddItem(newMainItem, MealType.MAIN)}
      </div>

      <div>
        <h3>Pudding Items</h3>
        {localMeals?.puddings.length > 0 ? (
          <ul className={listStyle}>
            {localMeals.puddings.map((pudding: Pudding) =>
              renderMenuItem(pudding, MealType.PUDDING)
            )}
          </ul>
        ) : (
          <div className='text-center py-4 text-muted-foreground'>
            No puddings added yet. Add your first pudding below.
          </div>
        )}
        {renderAddItem(newPuddingItem, MealType.PUDDING)}
      </div>
    </div>
  )
}
