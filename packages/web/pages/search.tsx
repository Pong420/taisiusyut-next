import { Header } from '@/components/Layout/Header';
import { SearchPanel } from '@/components/SearchPanel';

export default function SearchPage() {
  return (
    <div>
      <Header position="right" />
    </div>
  );
}

SearchPage.leftPanel = SearchPanel;
