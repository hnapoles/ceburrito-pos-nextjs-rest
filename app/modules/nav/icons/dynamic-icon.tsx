/*
import React from 'react';
import dynamic from 'next/dynamic';

type Props = {
  iconName: string;
  size?: number;
  color?: string;
};

const DynamicIcon: React.FC<Props> = ({ iconName, size = 24, color = 'currentColor' }) => {
  const Icon = dynamic(() =>
    import('lucide-react').then((icons) => icons[iconName as keyof typeof icons] || (() => null))
  );

  return <Icon size={size} color={color} />;
};

export default DynamicIcon;
*/


/*
'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { LightbulbIcon as LucideProps, Loader2 } from 'lucide-react'

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = dynamic<React.ComponentType<Omit<LucideProps, 'ref'>>>(
    () => import('lucide-react').then((mod) => {
      const Icon = mod[name as keyof typeof mod]
      return Icon as React.ComponentType<Omit<LucideProps, 'ref'>>
    }),
    {
      loading: () => <Loader2 {...props} className="animate-spin" />,
      ssr: false,
    }
  )

  return <IconComponent {...props} />
}

export default DynamicIcon
*/

/*
import { FC } from 'react';
import { loadIcon } from './loadicons';

interface DynamicIconProps {
  iconName: string;
  size?: number;
  color?: string;
}

const DynamicIcon: FC<DynamicIconProps> = ({ iconName, size = 24, color = 'currentColor' }) => {
  const Icon = loadIcon(iconName);

  if (!Icon) {
    return null; // Handle cases where the icon doesn't exist
  }

  return <Icon size={size} color={color} />;
};

export default DynamicIcon;
*/
