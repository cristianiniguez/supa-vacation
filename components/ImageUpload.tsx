import { useState, useRef, FC, ChangeEventHandler } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import { ArrowUpIcon } from '@heroicons/react/outline';

type ImageUploadProps = {
  label?: string;
  initialImage?: { src: string | null; alt: string };
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  accept?: string;
  sizeLimit?: number;
  onChangePicture?: (image: string) => void;
};

const ImageUpload: FC<ImageUploadProps> = ({
  label = 'Image',
  initialImage = null,
  objectFit = 'cover',
  accept = '.png, .jpg, .jpeg, .gif',
  sizeLimit = 10 * 1024 * 1024, // 10MB
  onChangePicture = () => null,
}) => {
  const pictureRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState(initialImage);
  const [updatingPicture, setUpdatingPicture] = useState(false);
  const [pictureError, setPictureError] = useState<string | null>(null);

  const handleOnChangePicture: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];

    const reader = new FileReader();

    const fileName = file?.name?.split('.')?.[0] ?? 'New file';

    reader.addEventListener(
      'load',
      async function () {
        try {
          setImage({ src: reader.result as string, alt: fileName });
          if (typeof onChangePicture === 'function') {
            await onChangePicture(reader.result as string);
          }
        } catch (err) {
          toast.error('Unable to update image');
        } finally {
          setUpdatingPicture(false);
        }
      },
      false,
    );

    if (file) {
      if (file.size <= sizeLimit) {
        setUpdatingPicture(true);
        setPictureError('');
        reader.readAsDataURL(file);
      } else {
        setPictureError('File size is exceeding 10MB.');
      }
    }
  };

  const handleOnClickPicture = () => {
    if (pictureRef.current) {
      pictureRef.current.click();
    }
  };

  return (
    <div className='flex flex-col space-y-2'>
      <label className='text-gray-600'>{label}</label>

      <button
        disabled={updatingPicture}
        onClick={handleOnClickPicture}
        className={classNames(
          'relative aspect-w-16 aspect-h-9 overflow-hidden rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition group focus:outline-none',
          image?.src
            ? 'hover:opacity-50 disabled:hover:opacity-100'
            : 'border-2 border-dashed hover:border-gray-400 focus:border-gray-400 disabled:hover:border-gray-200',
        )}
      >
        {image?.src ? (
          <Image src={image.src} alt={image?.alt ?? ''} layout='fill' objectFit={objectFit} />
        ) : null}

        <div className='flex items-center justify-center'>
          {!image?.src ? (
            <div className='flex flex-col items-center space-y-2'>
              <div className='shrink-0 rounded-full p-2 bg-gray-200 group-hover:scale-110 group-focus:scale-110 transition'>
                <ArrowUpIcon className='w-4 h-4 text-gray-500 transition' />
              </div>
              <span className='text-xs font-semibold text-gray-500 transition'>
                {updatingPicture ? 'Uploading...' : 'Upload'}
              </span>
            </div>
          ) : null}
          <input
            ref={pictureRef}
            type='file'
            accept={accept}
            onChange={handleOnChangePicture}
            className='hidden'
          />
        </div>
      </button>

      {pictureError ? <span className='text-red-600 text-sm'>{pictureError}</span> : null}
    </div>
  );
};

export default ImageUpload;
