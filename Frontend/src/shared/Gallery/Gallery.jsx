import "./Gallery.css";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import slider1 from '../../assets/main.png'
import slider2 from '../../assets/slider2.2.png'
import slider3 from '../../assets/slider3.png'
import slider4 from "../../assets/mainPhoto.png"
import slider5 from "../../assets/mainPhoto2.png"
import Footer from "../Footer/Footer";

function Gallery() {
  const photos = [
    { src: slider1, width: 1600, height: 1200 },
    { src: slider2, width: 1600, height: 1400 },
    { src: slider3, width: 1000, height: 1200 },
    { src: slider4, width: 1800, height: 1000 },
    { src: slider5, width: 1000, height: 400 }
  ];

  return (
    <>
      <div className="gallery">
        <h1>Gallery</h1>
        <p>Explore our hotel</p>
        <RowsPhotoAlbum photos={photos} />
      </div>
      <Footer />
    </>
  );
}

export default Gallery;