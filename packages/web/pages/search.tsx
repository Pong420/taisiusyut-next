import { Header } from '@/components/Layout/Header';
import { SearchPanel } from '@/components/SearchPanel';

export default function SearchPage() {
  return (
    <div>
      <Header />
    </div>
  );
}

SearchPage.leftPanel = SearchPanel;
