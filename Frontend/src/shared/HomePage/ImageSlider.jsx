import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import "./ImageSlider.css"

import slider1 from '../../assets/slider1.png'
import slider2 from '../../assets/slider2.2.png'
import slider3 from '../../assets/slider3.png'


function ImageSlider() {
  const settings = {
    dots: true,
    infinity: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1, 
    centerMode: true,
    centerPadding: "40px",
    autoplay: false,
    autoplaySpeed: 3000,
    focusOnSelect: true
  };

  const images = [slider1, slider2, slider3];

  return (
    <div className="image-slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="image-slider-item">
            <img src={image} alt={`Slide ${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ImageSlider;