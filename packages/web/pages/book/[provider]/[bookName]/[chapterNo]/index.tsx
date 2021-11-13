import { GetServerSideProps } from 'next';
import { Chapter, ChapterData } from '@/components/Chapter';
import { getBookService } from '@taisiusyut-next/server';

export const getServerSideProps: GetServerSideProps<ChapterData> = async context => {
  const { bookName, provider, chapterNo } = context.query;
  const service = await getBookService();
  if (typeof bookName === 'string' && typeof provider === 'string' && typeof chapterNo === 'string') {
    const chapter = await service.getChapterContent({ bookName, provider, chapterNo: Number(chapterNo) });
    if (chapter) {
      return { props: { chapter, bookName, provider, chapterNo: Number(chapterNo) } };
    }
  }
  return { notFound: true };
};

export default function ChapterPage(props: ChapterData) {
  return <Chapter {...props} />;
}
