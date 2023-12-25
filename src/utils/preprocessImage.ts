import sharp from 'sharp';

export function preprocessImage(filePath: string) {

    
    const dpi = 300;
    const textSize = 12;

    const image = sharp(filePath);
    image.resize({ width: (textSize * dpi) / 72, height: (textSize * dpi) / 72 });
    image.grayscale();

    image.modulate({ brightness: 1.2, saturation: 0 });

    image.median(3);

    return image.toBuffer();
    
}

