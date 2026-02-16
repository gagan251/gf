import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const scrollerImages = PlaceHolderImages.filter(
    (img) => img.id.startsWith('scroller-')
);

export function ImageScroller() {
  if (scrollerImages.length === 0) return null;
  
  const images = [...scrollerImages, ...scrollerImages];

  return (
    <div>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll">
                {images.map((image, index) => (
                    <li key={`${image.id}-${index}`}>
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            width={240}
                            height={360}
                            className="rounded-lg object-cover aspect-[2/3] max-w-none"
                            data-ai-hint={image.imageHint}
                        />
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}
