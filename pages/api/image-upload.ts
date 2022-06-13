import { NextApiHandler } from 'next';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';

import { getEnvVariable } from '@/utils/server';

const supabase = createClient(getEnvVariable('SUPABASE_URL'), getEnvVariable('SUPABASE_KEY'));

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const handler: NextApiHandler = async (req, res) => {
  // Upload image to Supabase
  if (req.method === 'POST') {
    try {
      const { image } = req.body;

      if (!image) return res.status(500).json({ message: 'No image provided' });

      const contentType = image.match(/data:(.*);base64/)?.[1];
      const base64FileData = image.split('base64,')?.[1];

      if (!contentType || !base64FileData)
        return res.status(500).json({ message: 'Image data not valid' });

      const filename = nanoid();
      const ext = contentType.split('/')[1];
      const path = `${filename}.${ext}`;

      const { data, error: uploadError } = await supabase.storage
        .from(getEnvVariable('SUPABASE_BUCKET'))
        .upload(path, decode(base64FileData), {
          contentType,
          upsert: true,
        });

      if (uploadError || !data) {
        throw new Error('Unable to upload image to storage');
      }

      const url = `${getEnvVariable('SUPABASE_URL').replace(
        '.co',
        '.in',
      )}/storage/v1/object/public/${data.Key}`;
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export default handler;
