import React from 'react';
import { ButtonPopover, ButtonPopoverProps } from '@/components/ButtonPopover';
import { withAuthRequired } from '@/components/withAuthRequired';
import { useBookInShelfToggle } from '@/hooks/useBookShelf';

interface Props extends Omit<ButtonPopoverProps, 'icon' | 'content' | 'text' | 'children'> {
  bookID: string;
  bookName: string;
  provider: string;
  icon?: boolean;
}

const TriggerButton = withAuthRequired(ButtonPopover);

export function BookShelfToggle({ bookID, bookName, provider, icon, ...props }: Props) {
  const [shelf, loading, toggle] = useBookInShelfToggle({ bookID, provider, name: bookName });
  const text = shelf ? '移出書架' : '加入書架';

  return (
    <TriggerButton
      {...props}
      {...(icon ? { content: text } : { text })}
      icon={icon ? (shelf ? 'star' : 'star-empty') : undefined}
      loading={loading}
      onClick={() => toggle(shelf)}
    />
  );
}
