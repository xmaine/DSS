const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico').default;

async function createFavicon() {
  try {
    // Convert SVG to PNG first
    const svgPath = path.join(__dirname, 'public', 'favicon.svg');
    const pngPath = path.join(__dirname, 'public', 'favicon-temp.png');
    const icoPath = path.join(__dirname, 'public', 'favicon.ico');
    
    // Read SVG content
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Convert SVG to PNG
    await sharp(Buffer.from(svgContent))
      .resize(32, 32)
      .png()
      .toFile(pngPath);
    
    console.log('PNG created successfully');
    
    // Convert PNG to ICO
    const buf = await pngToIco(pngPath);
    fs.writeFileSync(icoPath, buf);
    
    console.log('ICO created successfully');
    
    // Clean up temporary PNG file
    fs.unlinkSync(pngPath);
    
    console.log('Favicon updated successfully!');
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

createFavicon();