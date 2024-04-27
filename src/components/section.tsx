import { cn } from '@/lib/utils'

function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-t-4xl w-full -mt-10 text-5xl h-fit ', className)}
    >
      <article className='mb-12 px-6'>{props.children}</article>
    </div>
  )
}

export { Section }
