import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { NavLink, NavLinkProps } from 'react-router-dom';

type getStyles = (isActive: boolean) => string;
// why do i get error when I pass arrow fn directly?
export const getLinkItemStyles: getStyles = isActive =>
  cn(
    'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
    {
      'bg-accent/50': isActive,
      'text-accent-foreground': isActive,
    },
  );

export const getStandaloneLinkStyles: getStyles = isActive =>
  cn(
    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background  xs:text-sm sm:text-md md:text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
    { 'bg-accent/50': isActive },
  );

const titleVariants = cva('text-sm font-medium leading-none', {
  variants: {
    align: {
      start: 'self-start',
      center: 'self-center',
      end: 'self-end',
    },
  },
  defaultVariants: {
    align: 'start',
  },
});

export type LinkComponentProps = NavLinkProps & {
  children?: React.ReactNode;
  className?: string;
  titleAlign?: VariantProps<typeof titleVariants>['align'];
};

export const StandaloneNavLink = ({
  to,
  title,
  children,
  className,
  titleAlign,
  ...props
}: LinkComponentProps) => (
  <NavLink
    className={({ isActive }) =>
      cn(getStandaloneLinkStyles(isActive), 'flex flex-col px-3', className)
    }
    to={to}
    end
    {...props}
  >
    <div className={cn(titleVariants({ align: titleAlign }))}>{title}</div>
    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
      {children}
    </p>
  </NavLink>
);

export const NavLinkItem = ({
  to,
  title,
  children,
  className,
  ...props
}: LinkComponentProps) => (
  <li>
    <NavLink
      className={({ isActive }) => cn(getLinkItemStyles(isActive), className)}
      to={to}
      end
      {...props}
    >
      <div className="text-sm font-medium leading-none">{title}</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {children}
      </p>
    </NavLink>
  </li>
);
