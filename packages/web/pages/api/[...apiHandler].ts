import { getListener } from '@taisiusyut-next/server';
import { NextApiRequest, NextApiResponse, PageConfig } from 'next';

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async resolve => {
    const listener = await getListener();
    listener(req, res);
    res.on('finish', resolve);
  });
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};
