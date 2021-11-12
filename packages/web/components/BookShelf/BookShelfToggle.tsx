import React from 'react';
import { ButtonPopover, ButtonPopoverProps } from '@/components/ButtonPopover';
import { withAuthRequired } from '@/components/withAuthRequired';
import { useBookInShelfToggle } from '@/hooks/useBookShelf';

interface Props extends Omit<ButtonPopoverProps, 'icon' | 'content' | 'text' | 'children'> {
  bookID: string;
  provider: string;
  icon?: boolean;
}

const TriggerButton = withAuthRequired(ButtonPopover);

export function BookShelfToggle({ bookID, provider, icon, ...props }: Props) {
  const [exists, loading, toggle] = useBookInShelfToggle({ bookID, provider });
  const text = exists ? '移出書架' : '加入書架';

  return (
    <TriggerButton
      {...props}
      {...(icon ? { content: text } : { text })}
      icon={icon ? (exists ? 'star' : 'star-empty') : undefined}
      loading={loading}
      onClick={() => toggle(!exists)}
    />
  );
}
