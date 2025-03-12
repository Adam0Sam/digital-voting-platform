import { cva, VariantProps } from 'class-variance-authority';
import { FC, PropsWithChildren } from 'react';
import { Badge } from './ui/badge';

const statusBadgeVariants = cva('text-xs font-medium', {
  variants: {
    status: {
      draft: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      resolved: 'bg-gray-100 text-gray-800',
      aborted: 'bg-red-100 text-red-800',
    },
  },
  defaultVariants: {
    status: 'pending',
  },
});

export type StatusBadgeProps = {
  status: VariantProps<typeof statusBadgeVariants>['status'];
};

const StatusBadge: FC<PropsWithChildren<StatusBadgeProps>> = ({
  status,
  children,
}) => {
  return (
    <Badge variant="outline" className={statusBadgeVariants({ status })}>
      {children}
    </Badge>
  );
};

export default StatusBadge;
