import { cn } from '@/lib/utils'

function Section({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div id={props.id} className={cn('-mt-10 h-fit w-full', className)}>
      <article className='px-6'>{props.children}</article>
    </div>
  )
}

export { Section }
